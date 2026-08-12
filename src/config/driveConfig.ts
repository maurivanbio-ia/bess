/**
 * Google Drive API Configuration for BESS Platform
 * Uses Google Identity Services (GIS) OAuth2 for frontend authentication
 */
export const DRIVE_CONFIG = {
  // OAuth2 Client ID (safe to use in frontend)
  CLIENT_ID: '961953470991-08liprsm5j88cc5ckdgs432puvcf4qr6.apps.googleusercontent.com',

  // Root folder ID of the BESSA_BRASOL shared drive folder
  ROOT_FOLDER_ID: '10If7TPZOIDhBj8Ksg20SlH9otWbkSz2q',

  // Google Drive API scopes
  SCOPES: 'https://www.googleapis.com/auth/drive',

  // Google Drive API v3 base URL
  API_BASE: 'https://www.googleapis.com/drive/v3',

  // Upload endpoint
  UPLOAD_BASE: 'https://www.googleapis.com/upload/drive/v3',

  // Direct link to the Google Drive folder
  FOLDER_LINK: 'https://drive.google.com/drive/folders/10If7TPZOIDhBj8Ksg20SlH9otWbkSz2q?usp=sharing',
};
