import React, { useState, useEffect, useCallback } from 'react';
import { BESSProject } from '../data/bessData';
import { DRIVE_CONFIG } from '../config/driveConfig';
import {
  DriveFile,
  DriveAuthState,
  initGoogleAuth,
  revokeGoogleAuth,
  getUserInfo,
  getAccessToken,
  listFiles,
  uploadFile,
  createFolder,
  renameFile,
  moveFile,
  deleteFile,
  downloadFile,
} from '../services/googleDriveService';
import {
  ExternalLink,
  Globe,
  RefreshCw,
  HardDrive,
  FolderOpen,
  Folder,
  FileText,
  Upload,
  UploadCloud,
  Move,
  Edit3,
  Trash2,
  Plus,
  ChevronRight,
  ChevronDown,
  Download,
  LogIn,
  LogOut,
  User,
  FolderPlus,
  ArrowLeft,
  Search,
  File,
  Image,
  FileSpreadsheet,
  Map,
  X,
  Check,
  Loader2,
  AlertCircle,
  Info
} from 'lucide-react';

interface DriveFileManagerProps {
  projects: BESSProject[];
  documents: any[];
  onOpenNewDocument: (projectId?: string) => void;
  onEditDocument: (document: any) => void;
  onDeleteDocument: (docId: string) => void;
  onUploadDropFiles: (files: FileList, projectId?: string) => void;
  onClearAllDocuments: () => void;
}

export const DriveFileManager: React.FC<DriveFileManagerProps> = () => {
  // Auth state
  const [auth, setAuth] = useState<DriveAuthState>({
    isAuthenticated: false,
    accessToken: null,
    userEmail: null,
    userName: null,
    userPhoto: null,
  });

  // Drive state
  const [currentFolderId, setCurrentFolderId] = useState<string>(DRIVE_CONFIG.ROOT_FOLDER_ID);
  const [folderPath, setFolderPath] = useState<{ id: string; name: string }[]>([
    { id: DRIVE_CONFIG.ROOT_FOLDER_ID, name: 'BESSA_BRASOL' }
  ]);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // UI state
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [renamingFileId, setRenamingFileId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState<string>('');
  const [showNewFolderInput, setShowNewFolderInput] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [moveModal, setMoveModal] = useState<{ file: DriveFile; folders: DriveFile[] } | null>(null);
  const [moveFolderId, setMoveFolderId] = useState<string>('');

  // ─── Auth Handlers ──────────────────────────────────────────

  const handleLogin = async () => {
    try {
      setError(null);
      await initGoogleAuth();
      const userInfo = await getUserInfo();
      setAuth({
        isAuthenticated: true,
        accessToken: getAccessToken(),
        userEmail: userInfo?.email || null,
        userName: userInfo?.name || null,
        userPhoto: userInfo?.picture || null,
      });
    } catch (err: any) {
      setError(`Erro de autenticação: ${err.message}`);
    }
  };

  const handleLogout = async () => {
    await revokeGoogleAuth();
    setAuth({
      isAuthenticated: false,
      accessToken: null,
      userEmail: null,
      userName: null,
      userPhoto: null,
    });
    setFiles([]);
    setCurrentFolderId(DRIVE_CONFIG.ROOT_FOLDER_ID);
    setFolderPath([{ id: DRIVE_CONFIG.ROOT_FOLDER_ID, name: 'BESSA_BRASOL' }]);
  };

  // ─── Load Files ─────────────────────────────────────────────

  const loadFiles = useCallback(async () => {
    if (!auth.isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await listFiles(currentFolderId);
      setFiles(result);
    } catch (err: any) {
      setError(err.message);
      if (err.message.includes('Token expirado')) {
        setAuth(prev => ({ ...prev, isAuthenticated: false, accessToken: null }));
      }
    } finally {
      setIsLoading(false);
    }
  }, [auth.isAuthenticated, currentFolderId]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // ─── Folder Navigation ─────────────────────────────────────

  const navigateToFolder = (folder: DriveFile) => {
    setCurrentFolderId(folder.id);
    setFolderPath(prev => [...prev, { id: folder.id, name: folder.name }]);
    setSearchTerm('');
  };

  const navigateToBreadcrumb = (index: number) => {
    const target = folderPath[index];
    setCurrentFolderId(target.id);
    setFolderPath(prev => prev.slice(0, index + 1));
    setSearchTerm('');
  };

  const navigateBack = () => {
    if (folderPath.length <= 1) return;
    navigateToBreadcrumb(folderPath.length - 2);
  };

  // ─── File Operations ───────────────────────────────────────

  const handleUploadFiles = async (fileList: FileList) => {
    if (!auth.isAuthenticated) return;
    setIsUploading(true);
    setError(null);
    try {
      for (let i = 0; i < fileList.length; i++) {
        setUploadProgress(`Enviando ${i + 1} de ${fileList.length}: ${fileList[i].name}`);
        await uploadFile(fileList[i], currentFolderId);
      }
      setUploadProgress('');
      await loadFiles();
    } catch (err: any) {
      setError(`Erro no upload: ${err.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress('');
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim() || !auth.isAuthenticated) return;
    try {
      setError(null);
      await createFolder(newFolderName.trim(), currentFolderId);
      setNewFolderName('');
      setShowNewFolderInput(false);
      await loadFiles();
    } catch (err: any) {
      setError(`Erro ao criar pasta: ${err.message}`);
    }
  };

  const handleRename = async (fileId: string) => {
    if (!renameValue.trim()) return;
    try {
      setError(null);
      await renameFile(fileId, renameValue.trim());
      setRenamingFileId(null);
      setRenameValue('');
      await loadFiles();
    } catch (err: any) {
      setError(`Erro ao renomear: ${err.message}`);
    }
  };

  const handleDelete = async (file: DriveFile) => {
    if (!window.confirm(`Confirma a exclusão de "${file.name}"? O arquivo será enviado para a Lixeira do Google Drive.`)) return;
    try {
      setError(null);
      await deleteFile(file.id);
      await loadFiles();
    } catch (err: any) {
      setError(`Erro ao excluir: ${err.message}`);
    }
  };

  const handleMoveFile = async () => {
    if (!moveModal || !moveFolderId) return;
    try {
      setError(null);
      await moveFile(moveModal.file.id, moveFolderId, currentFolderId);
      setMoveModal(null);
      setMoveFolderId('');
      await loadFiles();
    } catch (err: any) {
      setError(`Erro ao mover: ${err.message}`);
    }
  };

  const openMoveModal = async (file: DriveFile) => {
    try {
      // Load folders at root level for selection
      const rootFolders = await listFiles(DRIVE_CONFIG.ROOT_FOLDER_ID);
      const folderList = rootFolders.filter(f => f.isFolder);
      setMoveModal({ file, folders: folderList });
    } catch (err: any) {
      setError(`Erro ao carregar pastas: ${err.message}`);
    }
  };

  // ─── Drag & Drop ───────────────────────────────────────────

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (auth.isAuthenticated) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && auth.isAuthenticated) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  // ─── File Icon Helper ──────────────────────────────────────

  const getFileIcon = (file: DriveFile) => {
    if (file.isFolder) return <Folder size={18} style={{ color: '#f59e0b' }} />;
    const name = file.name.toLowerCase();
    const mime = file.mimeType || '';
    if (name.endsWith('.pdf') || mime.includes('pdf')) return <FileText size={18} style={{ color: '#dc2626' }} />;
    if (name.endsWith('.xlsx') || name.endsWith('.xls') || mime.includes('spreadsheet')) return <FileSpreadsheet size={18} style={{ color: '#059669' }} />;
    if (name.endsWith('.kmz') || name.endsWith('.kml')) return <Map size={18} style={{ color: '#8b5cf6' }} />;
    if (mime.includes('image')) return <Image size={18} style={{ color: '#3b82f6' }} />;
    if (name.endsWith('.docx') || name.endsWith('.doc') || mime.includes('document')) return <FileText size={18} style={{ color: '#2563eb' }} />;
    return <File size={18} style={{ color: 'var(--text-muted)' }} />;
  };

  const formatSize = (sizeStr?: string) => {
    if (!sizeStr) return '';
    const bytes = parseInt(sizeStr, 10);
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  // ─── Filtered Files ────────────────────────────────────────

  const filteredFiles = files.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const folders = filteredFiles.filter(f => f.isFolder);
  const documents = filteredFiles.filter(f => !f.isFolder);

  // ─── Render ────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* 1. Header Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.06) 0%, rgba(5, 150, 105, 0.06) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <HardDrive size={22} style={{ color: 'var(--brasol-teal)' }} />
              <h2 style={{ fontSize: '1.25rem' }}>Repositório Digital BESS — Google Drive API Integrado</h2>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Acesso completo: navegar, fazer upload, mover, renomear e excluir arquivos — tudo salvo automaticamente no Google Drive oficial.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {auth.isAuthenticated ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.75rem', background: 'rgba(5, 150, 105, 0.1)', borderRadius: 'var(--radius-full)', border: '1px solid rgba(5, 150, 105, 0.25)' }}>
                  {auth.userPhoto ? (
                    <img src={auth.userPhoto} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                  ) : (
                    <User size={16} style={{ color: 'var(--ecobrasil-green)' }} />
                  )}
                  <span style={{ fontSize: '0.775rem', fontWeight: 600, color: 'var(--ecobrasil-green)' }}>
                    {auth.userName || auth.userEmail}
                  </span>
                </div>

                <button className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.775rem' }} onClick={loadFiles}>
                  <RefreshCw size={14} /> Atualizar
                </button>

                <a href={DRIVE_CONFIG.FOLDER_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.775rem' }}>
                  <ExternalLink size={14} /> Abrir no Drive
                </a>

                <button className="btn btn-outline" style={{ padding: '0.4rem 0.75rem', fontSize: '0.775rem', color: '#dc2626', borderColor: '#fca5a5' }} onClick={handleLogout}>
                  <LogOut size={14} /> Desconectar
                </button>
              </>
            ) : (
              <button
                className="btn btn-primary"
                style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', fontWeight: 700, gap: '0.5rem' }}
                onClick={handleLogin}
              >
                <LogIn size={16} /> Conectar com Google Drive
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.25rem', background: 'rgba(220, 38, 38, 0.08)', border: '1px solid rgba(220, 38, 38, 0.25)', borderRadius: 'var(--radius-sm)', color: '#dc2626', fontSize: '0.85rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
          <button className="btn-icon" style={{ marginLeft: 'auto' }} onClick={() => setError(null)}><X size={16} /></button>
        </div>
      )}

      {/* Not Authenticated State */}
      {!auth.isAuthenticated && (
        <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Globe size={56} style={{ color: 'var(--text-muted)', opacity: 0.35, marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Conecte-se ao Google Drive para acessar os documentos
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            Após conectar, você poderá navegar por todas as pastas e subpastas, fazer upload de arquivos, renomear, mover e excluir documentos diretamente pela plataforma BESS.
          </p>
          <button
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.5rem', fontSize: '0.95rem', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', fontWeight: 700, gap: '0.5rem' }}
            onClick={handleLogin}
          >
            <LogIn size={18} /> Conectar com Google Drive
          </button>
        </div>
      )}

      {/* Authenticated: File Manager */}
      {auth.isAuthenticated && (
        <>
          {/* Breadcrumb + Actions Bar */}
          <div className="glass-panel" style={{ padding: '0.85rem 1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              {/* Breadcrumb */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                {folderPath.length > 1 && (
                  <button className="btn-icon" onClick={navigateBack} title="Voltar" style={{ marginRight: '0.35rem' }}>
                    <ArrowLeft size={16} />
                  </button>
                )}
                {folderPath.map((crumb, idx) => (
                  <React.Fragment key={crumb.id}>
                    {idx > 0 && <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />}
                    <button
                      onClick={() => navigateToBreadcrumb(idx)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: idx === folderPath.length - 1 ? 700 : 500,
                        color: idx === folderPath.length - 1 ? 'var(--brasol-teal)' : 'var(--text-secondary)',
                        fontSize: '0.85rem',
                        padding: '0.2rem 0.35rem',
                        borderRadius: '4px'
                      }}
                    >
                      {idx === 0 && <HardDrive size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />}
                      {crumb.name}
                    </button>
                  </React.Fragment>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button className="btn btn-outline" style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem' }}
                  onClick={() => setShowNewFolderInput(true)}>
                  <FolderPlus size={14} /> Nova Pasta
                </button>

                <label className="btn btn-primary" style={{ padding: '0.35rem 0.7rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                  <Upload size={14} /> Enviar Arquivo
                  <input type="file" multiple style={{ display: 'none' }} onChange={(e) => e.target.files && handleUploadFiles(e.target.files)} />
                </label>
              </div>
            </div>

            {/* New Folder Input */}
            {showNewFolderInput && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', padding: '0.65rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                <FolderPlus size={16} style={{ color: 'var(--brasol-teal)' }} />
                <input
                  type="text"
                  placeholder="Nome da nova pasta..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                  autoFocus
                  style={{ flex: 1, padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                />
                <button className="btn btn-primary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem' }} onClick={handleCreateFolder}>
                  <Check size={14} /> Criar
                </button>
                <button className="btn btn-outline" style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem' }} onClick={() => { setShowNewFolderInput(false); setNewFolderName(''); }}>
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1.25rem', background: 'rgba(2, 132, 199, 0.08)', border: '1px solid rgba(2, 132, 199, 0.25)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--brasol-teal)' }}>
              <Loader2 size={18} className="spin" />
              <span>{uploadProgress || 'Enviando arquivo...'}</span>
            </div>
          )}

          {/* Drag & Drop Zone + File Table */}
          <div
            className="glass-panel"
            style={{ padding: '1.25rem', minHeight: '400px' }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* Drop Overlay */}
            {isDragOver && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 10,
                background: 'rgba(2, 132, 199, 0.15)',
                border: '3px dashed var(--brasol-teal)',
                borderRadius: 'var(--radius-md)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <div style={{ textAlign: 'center', color: 'var(--brasol-teal)' }}>
                  <UploadCloud size={48} />
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '0.5rem' }}>Solte os arquivos aqui para enviar ao Google Drive</p>
                </div>
              </div>
            )}

            {/* Search */}
            <div style={{ marginBottom: '1rem' }}>
              <div className="search-box">
                <Search className="search-icon" />
                <input type="text" placeholder="Pesquisar arquivos e pastas nesta pasta..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>

            {/* Loading */}
            {isLoading && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <Loader2 size={32} className="spin" style={{ marginBottom: '0.5rem' }} />
                <p>Carregando arquivos do Google Drive...</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && filteredFiles.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                <FolderOpen size={48} style={{ opacity: 0.35, marginBottom: '0.75rem' }} />
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.35rem' }}>Esta pasta está vazia</h4>
                <p style={{ fontSize: '0.85rem' }}>Arraste e solte arquivos aqui ou use o botão <strong>"Enviar Arquivo"</strong> acima.</p>
              </div>
            )}

            {/* File Table */}
            {!isLoading && filteredFiles.length > 0 && (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Tipo</th>
                      <th>Tamanho</th>
                      <th>Última Modificação</th>
                      <th>Proprietário</th>
                      <th style={{ textAlign: 'right' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Folders first */}
                    {folders.map((file) => (
                      <tr key={file.id} onDoubleClick={() => navigateToFolder(file)} style={{ cursor: 'pointer' }}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {getFileIcon(file)}
                            {renamingFileId === file.id ? (
                              <div style={{ display: 'flex', gap: '0.3rem', flex: 1 }}>
                                <input type="text" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleRename(file.id)} autoFocus style={{ flex: 1, padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.825rem' }} />
                                <button className="btn-icon" onClick={() => handleRename(file.id)}><Check size={14} style={{ color: '#059669' }} /></button>
                                <button className="btn-icon" onClick={() => setRenamingFileId(null)}><X size={14} /></button>
                              </div>
                            ) : (
                              <span style={{ fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer' }} onClick={() => navigateToFolder(file)}>
                                {file.name}
                              </span>
                            )}
                          </div>
                        </td>
                        <td><span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>Pasta</span></td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>—</td>
                        <td style={{ fontSize: '0.8rem' }}>{formatDate(file.modifiedTime)}</td>
                        <td style={{ fontSize: '0.8rem' }}>{file.owners?.[0]?.displayName || '—'}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'flex-end' }}>
                            <button className="btn-icon" title="Renomear" onClick={(e) => { e.stopPropagation(); setRenamingFileId(file.id); setRenameValue(file.name); }}><Edit3 size={14} /></button>
                            <button className="btn-icon" style={{ color: '#dc2626' }} title="Excluir" onClick={(e) => { e.stopPropagation(); handleDelete(file); }}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* Then files */}
                    {documents.map((file) => (
                      <tr key={file.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {getFileIcon(file)}
                            {renamingFileId === file.id ? (
                              <div style={{ display: 'flex', gap: '0.3rem', flex: 1 }}>
                                <input type="text" value={renameValue} onChange={(e) => setRenameValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleRename(file.id)} autoFocus style={{ flex: 1, padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.825rem' }} />
                                <button className="btn-icon" onClick={() => handleRename(file.id)}><Check size={14} style={{ color: '#059669' }} /></button>
                                <button className="btn-icon" onClick={() => setRenamingFileId(null)}><X size={14} /></button>
                              </div>
                            ) : (
                              <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{file.name}</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
                            {file.name.split('.').pop()?.toUpperCase() || 'Arquivo'}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.8rem' }}>{formatSize(file.size)}</td>
                        <td style={{ fontSize: '0.8rem' }}>{formatDate(file.modifiedTime)}</td>
                        <td style={{ fontSize: '0.8rem' }}>{file.owners?.[0]?.displayName || '—'}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.3rem', justifyContent: 'flex-end' }}>
                            <button className="btn-icon" title="Baixar / Abrir" onClick={() => downloadFile(file)}><Download size={14} /></button>
                            <button className="btn-icon" title="Renomear" onClick={() => { setRenamingFileId(file.id); setRenameValue(file.name); }}><Edit3 size={14} /></button>
                            <button className="btn-icon" title="Mover para..." onClick={() => openMoveModal(file)}><Move size={14} /></button>
                            <button className="btn-icon" style={{ color: '#dc2626' }} title="Excluir" onClick={() => handleDelete(file)}><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Stats Footer */}
            {!isLoading && filteredFiles.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', padding: '0.65rem 0.75rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
                <span>📁 {folders.length} pasta(s) | 📄 {documents.length} arquivo(s)</span>
                <span>Pasta atual: <strong style={{ color: 'var(--brasol-teal)' }}>{folderPath[folderPath.length - 1]?.name}</strong></span>
              </div>
            )}
          </div>
        </>
      )}

      {/* Move File Modal */}
      {moveModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Move size={18} style={{ color: 'var(--brasol-teal)' }} /> Mover "{moveModal.file.name}"
              </h3>
              <button className="btn-icon" onClick={() => { setMoveModal(null); setMoveFolderId(''); }}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Selecione a pasta de destino:</label>
              <select value={moveFolderId} onChange={(e) => setMoveFolderId(e.target.value)} style={{ width: '100%', padding: '0.55rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                <option value="">Selecione...</option>
                <option value={DRIVE_CONFIG.ROOT_FOLDER_ID}>📁 BESSA_BRASOL (Raiz)</option>
                {moveModal.folders.filter(f => f.id !== currentFolderId).map(f => (
                  <option key={f.id} value={f.id}>📁 {f.name}</option>
                ))}
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => { setMoveModal(null); setMoveFolderId(''); }}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleMoveFile} disabled={!moveFolderId}>Mover Arquivo</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
