import React, { useState } from 'react';
import { BESSDocument, BESSProject } from '../data/bessData';
import { 
  ExternalLink, 
  Globe, 
  RefreshCw, 
  List, 
  Grid, 
  Info,
  HardDrive,
  FolderOpen,
  Upload,
  Move,
  Edit3,
  Trash2,
  Maximize2
} from 'lucide-react';

interface DriveFileManagerProps {
  projects: BESSProject[];
  documents: BESSDocument[];
  onOpenNewDocument: (projectId?: string) => void;
  onEditDocument: (document: BESSDocument) => void;
  onDeleteDocument: (docId: string) => void;
  onUploadDropFiles: (files: FileList, projectId?: string) => void;
  onClearAllDocuments: () => void;
}

export const DriveFileManager: React.FC<DriveFileManagerProps> = () => {
  const [embedViewType, setEmbedViewType] = useState<'list' | 'grid'>('list');
  const [iframeKey, setIframeKey] = useState<number>(0);

  const googleDriveFolderId = "10If7TPZOIDhBj8Ksg20SlH9otWbkSz2q";
  const googleDriveLink = `https://drive.google.com/drive/folders/${googleDriveFolderId}?usp=sharing`;
  const googleDriveEmbedUrl = `https://drive.google.com/embeddedfolderview?id=${googleDriveFolderId}#${embedViewType}`;

  const handleRefreshIframe = () => {
    setIframeKey(prev => prev + 1);
  };

  // Open Google Drive in a controlled popup window for FULL editing access
  const handleOpenDrivePopup = () => {
    const width = Math.min(1400, window.screen.width - 100);
    const height = Math.min(850, window.screen.height - 150);
    const left = Math.round((window.screen.width - width) / 2);
    const top = Math.round((window.screen.height - height) / 2);

    window.open(
      googleDriveLink,
      'GoogleDriveBESS',
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=yes,status=no,resizable=yes,scrollbars=yes`
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* 1. Header Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.06) 0%, rgba(5, 150, 105, 0.06) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <HardDrive size={22} style={{ color: 'var(--brasol-teal)' }} />
              <h2 style={{ fontSize: '1.25rem' }}>Repositório Digital BESS (Google Drive Ao Vivo)</h2>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Acesso em tempo real a todas as pastas, subpastas e documentos do diretório <strong>BESSA_BRASOL</strong>.
            </p>
          </div>

          {/* Quick Action Controls */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
            
            {/* View Mode Selector */}
            <div style={{ display: 'flex', background: 'var(--bg-main)', padding: '0.2rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <button
                className={`btn ${embedViewType === 'list' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', border: 'none', gap: '0.3rem' }}
                onClick={() => setEmbedViewType('list')}
              >
                <List size={13} /> Lista
              </button>
              <button
                className={`btn ${embedViewType === 'grid' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', border: 'none', gap: '0.3rem' }}
                onClick={() => setEmbedViewType('grid')}
              >
                <Grid size={13} /> Grade
              </button>
            </div>

            {/* Refresh */}
            <button 
              className="btn btn-outline"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.775rem', gap: '0.35rem' }}
              onClick={handleRefreshIframe}
              title="Atualizar exibição"
            >
              <RefreshCw size={14} /> Atualizar
            </button>

            {/* FULL ACCESS BUTTON - Opens Google Drive in popup for complete control */}
            <button 
              onClick={handleOpenDrivePopup}
              className="btn btn-primary"
              style={{ 
                padding: '0.5rem 1rem', 
                fontSize: '0.825rem', 
                gap: '0.45rem', 
                background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)'
              }}
            >
              <Maximize2 size={15} /> Acesso Total (Editar / Mover / Inserir)
            </button>
          </div>
        </div>
      </div>

      {/* 2. Info Banner - How to use */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-sm)',
        background: 'rgba(5, 150, 105, 0.07)',
        border: '1px solid rgba(5, 150, 105, 0.2)',
        fontSize: '0.825rem',
        color: 'var(--text-secondary)'
      }}>
        <Info size={20} style={{ color: 'var(--ecobrasil-green)', flexShrink: 0, marginTop: '0.15rem' }} />
        <div>
          <strong style={{ color: 'var(--text-primary)', fontSize: '0.875rem' }}>
            Como gerenciar documentos com acesso total:
          </strong>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.6rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Upload size={14} style={{ color: 'var(--brasol-teal)' }} />
              <span><strong>Inserir:</strong> Clique em "Acesso Total" → Arraste arquivos para a pasta desejada</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Move size={14} style={{ color: '#3b82f6' }} />
              <span><strong>Mover:</strong> Arraste entre pastas ou use "Mover para" no menu de contexto</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Edit3 size={14} style={{ color: '#f59e0b' }} />
              <span><strong>Renomear:</strong> Botão direito no arquivo → "Renomear"</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Trash2 size={14} style={{ color: '#dc2626' }} />
              <span><strong>Excluir:</strong> Selecione e pressione Delete ou use o menu de contexto</span>
            </div>
          </div>
          <p style={{ marginTop: '0.5rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
            💡 Todas as alterações feitas no <strong>"Acesso Total"</strong> são salvas automaticamente no Google Drive oficial.
          </p>
        </div>
      </div>

      {/* 3. Embedded Google Drive Live Container (Read-only preview) */}
      <div className="glass-panel" style={{ padding: '1rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', padding: '0 0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <Globe size={16} style={{ color: 'var(--brasol-teal)' }} />
            <span>Pré-visualização da pasta <strong>BESSA_BRASOL</strong> — Para editar, clique em <strong>"Acesso Total"</strong></span>
          </div>

          <a 
            href={googleDriveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', gap: '0.3rem' }}
          >
            <ExternalLink size={13} /> Abrir em Nova Guia
          </a>
        </div>

        {/* Live Iframe Viewer */}
        <div style={{ width: '100%', height: '700px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)', background: '#ffffff' }}>
          <iframe
            key={iframeKey}
            src={googleDriveEmbedUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Google Drive BESS Live Folder"
            allow="autoplay"
          />
        </div>
      </div>

    </div>
  );
};
