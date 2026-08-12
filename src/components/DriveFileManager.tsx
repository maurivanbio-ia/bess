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
  FolderOpen
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* 1. Header Banner with Direct Google Drive Actions */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.06) 0%, rgba(5, 150, 105, 0.06) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <HardDrive size={22} style={{ color: 'var(--brasol-teal)' }} />
              <h2 style={{ fontSize: '1.25rem' }}>Repositório Digital de Licenciamento BESS (Google Drive Ao Vivo)</h2>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Acesso em tempo real a todas as pastas, subpastas, certidões CUOS, licenças, dispensas e arquivos KMZ do diretório <strong>BESSA_BRASOL</strong>.
            </p>
          </div>

          {/* Quick Action Controls */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
            
            {/* View Mode Selector: List vs Grid */}
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

            {/* Refresh Button */}
            <button 
              className="btn btn-outline"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.775rem', gap: '0.35rem' }}
              onClick={handleRefreshIframe}
              title="Atualizar exibição do Google Drive"
            >
              <RefreshCw size={14} /> Atualizar
            </button>

            {/* Direct Link to Open Google Drive */}
            <a 
              href={googleDriveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', gap: '0.4rem', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)' }}
            >
              <ExternalLink size={15} /> Abrir no Google Drive
            </a>
          </div>
        </div>
      </div>

      {/* 2. Embedded Google Drive Live Container */}
      <div className="glass-panel" style={{ padding: '1rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', padding: '0 0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <Globe size={16} style={{ color: 'var(--brasol-teal)' }} />
            <span>Navegação oficial ao vivo: <strong>Pasta Raiz BESSA_BRASOL</strong></span>
          </div>

          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Info size={13} /> Clique em qualquer pasta ou subpasta para abrir o conteúdo.
          </div>
        </div>

        {/* Live Iframe Viewer */}
        <div style={{ width: '100%', height: '760px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--border-color)', background: '#ffffff' }}>
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
