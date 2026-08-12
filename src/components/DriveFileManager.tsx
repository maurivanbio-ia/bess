import React, { useState } from 'react';
import { BESSDocument, BESSProject } from '../data/bessData';
import { 
  Folder, 
  FileText, 
  Plus, 
  Search, 
  Download, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  UploadCloud, 
  FolderPlus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Paperclip, 
  Info,
  ChevronRight,
  HardDrive,
  Filter
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface DriveFileManagerProps {
  projects: BESSProject[];
  documents: BESSDocument[];
  onOpenNewDocument: (projectId?: string) => void;
  onEditDocument: (document: BESSDocument) => void;
  onDeleteDocument: (docId: string) => void;
  onUploadDropFiles: (files: FileList, projectId?: string) => void;
  onClearAllDocuments: () => void;
}

export const DriveFileManager: React.FC<DriveFileManagerProps> = ({
  projects,
  documents,
  onOpenNewDocument,
  onEditDocument,
  onDeleteDocument,
  onUploadDropFiles,
  onClearAllDocuments
}) => {
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const googleDriveLink = "https://drive.google.com/drive/folders/10If7TPZOIDhBj8Ksg20SlH9otWbkSz2q?usp=sharing";

  // Filter documents
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.numeroProtocolo && doc.numeroProtocolo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.observacoes && doc.observacoes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFolder = selectedFolder === 'all' || doc.projectId === selectedFolder;
    const matchesCategory = selectedCategory === 'all' || doc.tipo === selectedCategory;

    return matchesSearch && matchesFolder && matchesCategory;
  });

  // Handle Drag & Drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
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

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUploadDropFiles(e.dataTransfer.files, selectedFolder !== 'all' ? selectedFolder : undefined);
    }
  };

  const handleFileSelectInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadDropFiles(e.target.files, selectedFolder !== 'all' ? selectedFolder : undefined);
    }
  };

  // Export to Excel
  const handleExportExcel = () => {
    if (documents.length === 0) {
      alert('Não há documentos no repositório para exportar.');
      return;
    }
    const rows = filteredDocs.map(d => ({
      'Nomenclatura do Documento': d.nome,
      'Empreendimento / Pasta': d.projectName,
      'Categoria': d.tipo,
      'Status Regulatório': d.status,
      'Número do Protocolo': d.numeroProtocolo || 'N/A',
      'Data de Emissão': d.dataEmissao || 'N/A',
      'Data de Validade': d.dataValidade || 'N/A',
      'Informações Relevantes': d.observacoes || '',
      'Arquivo Original': d.nomeArquivoOriginal || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Drive Documentos BESS');
    XLSX.writeFile(workbook, `Repositorio_Drive_Documentos_BESS_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 1. Header Banner with Google Drive Link */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <HardDrive size={24} style={{ color: 'var(--brasol-teal)' }} />
              <h2 style={{ fontSize: '1.3rem' }}>Repositório Digital de Documentos BESS (Google Drive)</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Gerencie, visualize, insira, renomeie e organize todas as certidões CUOS, licenças, pareceres e arquivos KMZ.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a 
              href={googleDriveLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', gap: '0.4rem' }}
            >
              <ExternalLink size={16} /> Abrir Pasta Oficial Google Drive
            </a>
            
            <button className="btn btn-outline" onClick={handleExportExcel}>
              <Download size={16} /> Exportar Inventário (.xlsx)
            </button>

            <button className="btn btn-primary" onClick={() => onOpenNewDocument(selectedFolder !== 'all' ? selectedFolder : undefined)}>
              <Plus size={16} /> + Inserir Documento
            </button>
          </div>
        </div>
      </div>

      {/* 2. Drag and Drop Interactive Upload Zone */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: isDragOver ? '2px dashed var(--brasol-teal)' : '2px dashed var(--border-color-strong)',
          background: isDragOver ? 'rgba(2, 132, 199, 0.08)' : 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          transition: 'all 0.2s ease',
          cursor: 'pointer'
        }}
        onClick={() => document.getElementById('drive-file-input')?.click()}
      >
        <input 
          type="file" 
          id="drive-file-input" 
          multiple 
          style={{ display: 'none' }} 
          onChange={handleFileSelectInput}
        />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <UploadCloud size={38} style={{ color: isDragOver ? 'var(--brasol-teal)' : 'var(--text-muted)' }} />
          <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
            Arraste e solte arquivos aqui para enviar ao repositório
          </strong>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            Suporta arquivos <strong>.pdf, .docx, .kmz, .kml, .xlsx e imagens</strong> para cadastro imediato.
          </p>
        </div>
      </div>

      {/* 3. Folder Explorer & Filters Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '1.5rem' }}>
        
        {/* Left Folder Tree Directory */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            PASTAS POR EMPREENDIMENTO
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <button
              className={`sidebar-menu-btn ${selectedFolder === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedFolder('all')}
            >
              <div className="sidebar-menu-left">
                <Folder size={16} className="sidebar-menu-icon" />
                <span>Todas as Pastas ({documents.length})</span>
              </div>
            </button>

            {projects.map(p => {
              const count = documents.filter(d => d.projectId === p.id).length;
              return (
                <button
                  key={p.id}
                  className={`sidebar-menu-btn ${selectedFolder === p.id ? 'active' : ''}`}
                  onClick={() => setSelectedFolder(p.id)}
                >
                  <div className="sidebar-menu-left">
                    <Folder size={16} style={{ color: 'var(--brasol-teal)' }} />
                    <span style={{ fontSize: '0.825rem' }}>{p.nome}</span>
                  </div>
                  <span className="sidebar-badge">{count}</span>
                </button>
              );
            })}
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', margin: '1.25rem 0 0.75rem 0' }}></div>

          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            CATEGORIAS
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {[
              { id: 'all', label: 'Todas as Categorias' },
              { id: 'CUOS', label: 'Certidões CUOS' },
              { id: 'Certidão / Licença', label: 'Licenças / Dispensas' },
              { id: 'Estudo Ambiental', label: 'Estudos Ambientais' },
              { id: 'KMZ / Geoespacial', label: 'KMZ / Geoespacial' }
            ].map(cat => (
              <button
                key={cat.id}
                style={{
                  textAlign: 'left',
                  padding: '0.45rem 0.6rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  border: 'none',
                  background: selectedCategory === cat.id ? 'rgba(2, 132, 199, 0.1)' : 'transparent',
                  color: selectedCategory === cat.id ? 'var(--brasol-teal)' : 'var(--text-secondary)',
                  fontWeight: selectedCategory === cat.id ? 700 : 500,
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right Document Content List */}
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          
          {/* Top Search & Actions */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Pesquisar por nome, protocolo ou observações do documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-primary" onClick={() => onOpenNewDocument(selectedFolder !== 'all' ? selectedFolder : undefined)}>
                <Plus size={15} /> Novo Arquivo
              </button>
              {documents.length > 0 && (
                <button 
                  className="btn btn-outline" 
                  style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                  onClick={() => {
                    if (window.confirm('Confirma a exclusão de TODOS os documentos do repositório?')) {
                      onClearAllDocuments();
                    }
                  }}
                >
                  <Trash2 size={15} /> Apagar Todos
                </button>
              )}
            </div>
          </div>

          {/* Files Grid / Table */}
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nomenclatura do Documento</th>
                  <th>Empreendimento / Pasta</th>
                  <th>Tipo</th>
                  <th>Status</th>
                  <th>Protocolo</th>
                  <th>Validade</th>
                  <th>Arquivo</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                        <Folder size={42} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                        <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Nenhum documento encontrado nesta pasta.</strong>
                        <p style={{ fontSize: '0.825rem', maxWidth: '420px' }}>
                          Arraste arquivos para a área pontilhada acima ou clique em <strong>"+ Novo Arquivo"</strong> para cadastrar documentos.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr key={doc.id}>
                      <td style={{ fontWeight: 700 }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{doc.nome}</span>
                          {doc.observacoes && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                              {doc.observacoes.length > 60 ? `${doc.observacoes.substring(0, 60)}...` : doc.observacoes}
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--brasol-teal)' }}>
                          {doc.projectName}
                        </span>
                      </td>

                      <td>
                        <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>{doc.tipo}</span>
                      </td>

                      <td>
                        <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>{doc.status}</span>
                      </td>

                      <td style={{ fontSize: '0.775rem' }}>{doc.numeroProtocolo || 'N/A'}</td>
                      <td style={{ fontSize: '0.775rem' }}>{doc.dataValidade || 'N/A'}</td>

                      <td>
                        <a
                          href={doc.nomeArquivoOriginal?.endsWith('.kmz') || doc.nomeArquivoOriginal?.endsWith('.kml') ? `/kmz/${doc.nomeArquivoOriginal}` : googleDriveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.725rem', gap: '0.3rem' }}
                        >
                          <Paperclip size={12} /> {doc.nomeArquivoOriginal || 'Documento.pdf'}
                        </a>
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.35rem', justifyContent: 'flex-end' }}>
                          <button
                            className="btn-icon"
                            onClick={() => onEditDocument(doc)}
                            title="Modificar Documento"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            className="btn-icon"
                            style={{ color: '#dc2626' }}
                            onClick={() => {
                              if (window.confirm(`Confirma a exclusão de "${doc.nome}"?`)) {
                                onDeleteDocument(doc.id);
                              }
                            }}
                            title="Excluir Documento"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
};
