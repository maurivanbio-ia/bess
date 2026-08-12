/**
 * Google Drive API Service for BESS Platform
 * Handles OAuth2 authentication via Google Identity Services (GIS)
 * and all CRUD operations on Google Drive files/folders.
 */
import { DRIVE_CONFIG } from '../config/driveConfig';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  parents?: string[];
  modifiedTime?: string;
  size?: string;
  iconLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  thumbnailLink?: string;
  createdTime?: string;
  owners?: { displayName: string; emailAddress: string }[];
  isFolder: boolean;
}

export interface DriveAuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  userEmail: string | null;
  userName: string | null;
  userPhoto: string | null;
}

// ─── Token Storage ───────────────────────────────────────────────────────────

let currentAccessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  currentAccessToken = token;
};

export const getAccessToken = (): string | null => currentAccessToken;

// ─── Google Identity Services (GIS) Auth ─────────────────────────────────────

/**
 * Initialize Google OAuth2 login via GIS token model.
 * Returns a promise that resolves with the access token.
 */
export const initGoogleAuth = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Ensure the GIS script is loaded
    if (!(window as any).google?.accounts?.oauth2) {
      reject(new Error('Google Identity Services (GIS) script not loaded. Check index.html.'));
      return;
    }

    const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: DRIVE_CONFIG.CLIENT_ID,
      scope: DRIVE_CONFIG.SCOPES,
      callback: (response: any) => {
        if (response.error) {
          reject(new Error(response.error));
          return;
        }
        currentAccessToken = response.access_token;
        resolve(response.access_token);
      },
    });

    // Request the token (opens Google login popup)
    tokenClient.requestAccessToken();
  });
};

/**
 * Revoke the current access token (logout).
 */
export const revokeGoogleAuth = (): Promise<void> => {
  return new Promise((resolve) => {
    if (currentAccessToken && (window as any).google?.accounts?.oauth2) {
      (window as any).google.accounts.oauth2.revoke(currentAccessToken, () => {
        currentAccessToken = null;
        resolve();
      });
    } else {
      currentAccessToken = null;
      resolve();
    }
  });
};

/**
 * Get the current user's profile info using the access token.
 */
export const getUserInfo = async (): Promise<{ email: string; name: string; picture: string } | null> => {
  if (!currentAccessToken) return null;

  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${currentAccessToken}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return { email: data.email, name: data.name, picture: data.picture };
  } catch {
    return null;
  }
};

// ─── Helper: Authorized Fetch ────────────────────────────────────────────────

const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  if (!currentAccessToken) {
    throw new Error('Não autenticado. Faça login com o Google primeiro.');
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${currentAccessToken}`,
    ...(options.headers as Record<string, string> || {}),
  };

  const res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    currentAccessToken = null;
    throw new Error('Token expirado. Faça login novamente.');
  }

  return res;
};

// ─── Google Drive API Operations ─────────────────────────────────────────────

/**
 * List files and folders inside a given parent folder.
 */
export const listFiles = async (folderId: string = DRIVE_CONFIG.ROOT_FOLDER_ID): Promise<DriveFile[]> => {
  const query = `'${folderId}' in parents and trashed = false`;
  const fields = 'files(id,name,mimeType,parents,modifiedTime,size,iconLink,webViewLink,webContentLink,thumbnailLink,createdTime,owners)';
  const orderBy = 'folder,name';

  const url = `${DRIVE_CONFIG.API_BASE}/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}&orderBy=${encodeURIComponent(orderBy)}&pageSize=200`;

  const res = await authFetch(url);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Erro ao listar arquivos');
  }

  const data = await res.json();

  return (data.files || []).map((f: any) => ({
    ...f,
    isFolder: f.mimeType === 'application/vnd.google-apps.folder',
  }));
};

/**
 * Upload a file to a specific folder on Google Drive.
 */
export const uploadFile = async (file: File, parentFolderId: string = DRIVE_CONFIG.ROOT_FOLDER_ID): Promise<DriveFile> => {
  const metadata = {
    name: file.name,
    parents: [parentFolderId],
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', file);

  const res = await authFetch(
    `${DRIVE_CONFIG.UPLOAD_BASE}/files?uploadType=multipart&fields=id,name,mimeType,parents,modifiedTime,size,webViewLink,webContentLink`,
    { method: 'POST', body: form }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Erro ao fazer upload');
  }

  const data = await res.json();
  return { ...data, isFolder: false };
};

/**
 * Create a new folder inside a parent folder.
 */
export const createFolder = async (name: string, parentFolderId: string = DRIVE_CONFIG.ROOT_FOLDER_ID): Promise<DriveFile> => {
  const metadata = {
    name,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [parentFolderId],
  };

  const res = await authFetch(`${DRIVE_CONFIG.API_BASE}/files?fields=id,name,mimeType,parents,modifiedTime`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Erro ao criar pasta');
  }

  const data = await res.json();
  return { ...data, isFolder: true };
};

/**
 * Rename a file or folder.
 */
export const renameFile = async (fileId: string, newName: string): Promise<DriveFile> => {
  const res = await authFetch(`${DRIVE_CONFIG.API_BASE}/files/${fileId}?fields=id,name,mimeType,modifiedTime`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newName }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Erro ao renomear');
  }

  const data = await res.json();
  return { ...data, isFolder: data.mimeType === 'application/vnd.google-apps.folder' };
};

/**
 * Move a file to a different folder.
 */
export const moveFile = async (fileId: string, newParentId: string, currentParentId: string): Promise<DriveFile> => {
  const res = await authFetch(
    `${DRIVE_CONFIG.API_BASE}/files/${fileId}?addParents=${newParentId}&removeParents=${currentParentId}&fields=id,name,mimeType,parents,modifiedTime`,
    { method: 'PATCH' }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Erro ao mover arquivo');
  }

  const data = await res.json();
  return { ...data, isFolder: data.mimeType === 'application/vnd.google-apps.folder' };
};

/**
 * Delete a file (move to trash).
 */
export const deleteFile = async (fileId: string): Promise<void> => {
  const res = await authFetch(`${DRIVE_CONFIG.API_BASE}/files/${fileId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trashed: true }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || 'Erro ao excluir arquivo');
  }
};

/**
 * Download a file by opening its webContentLink or webViewLink.
 */
export const downloadFile = (file: DriveFile): void => {
  if (file.webContentLink) {
    window.open(file.webContentLink, '_blank');
  } else if (file.webViewLink) {
    window.open(file.webViewLink, '_blank');
  }
};
