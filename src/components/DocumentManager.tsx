import React, { useState } from 'react';
import { BESSDocument, BESSProject } from '../data/bessData';
import { downloadBESSFile } from '../utils/fileDownloader';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  Building, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trash2, 
  Edit3, 
  Tag, 
  Paperclip,
  Info,
  ChevronDown,
  ChevronUp,
  FileCheck
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface DocumentManagerProps {
  projects: BESSProject[];
  documents: BESSDocument[];
  onOpenNewDocument: (projectId?: string) => void;
  onEditDocument: (document: BESSDocument) => void;
  onDeleteDocument: (docId: string) => void;
  onClearAllDocuments: () => void;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  projects,
  documents,
  onOpenNewDocument,
  onEditDocument,
  onDeleteDocument,
  onClearAllDocuments
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

  // Filter Documents Logic
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.numeroProtocolo && doc.numeroProtocolo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.observacoes && doc.observacoes.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesProject = projectFilter === 'all' || doc.projectId === projectFilter;
    const matchesType = typeFilter === 'all' || doc.tipo === typeFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;

    return matchesSearch && matchesProject && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Emitido / Válido':
        return <span className="badge badge-green"><CheckCircle2 size={12} /> Emitido / Válido</span>;
      case 'Em Análise':
        return <span className="badge badge-blue"><Clock size={12} /> Em Análise no Órgão</span>;
      case 'Pendente':
        return <span className="badge badge-amber"><AlertCircle size={12} /> Pendente</span>;
      case 'Expirado':
        return <span className="badge badge-red"><AlertCircle size={12} /> Expirado</span>;
      default:
        return <span className="badge badge-blue">{status}</span>;
    }
  };

  const getTypeBadge = (tipo: string) => {
    switch (tipo) {
      case 'CUOS':
        return <span className="badge badge-green" style={{ fontWeight: 700 }}>CUOS</span>;
      case 'Certidão / Licença':
        return <span className="badge badge-blue">Licença / Dispensa</span>;
      case 'KMZ / Geoespacial':
        return <span className="badge badge-purple">KMZ Geoespacial</span>;
      case 'Estudo Ambiental':
        return <span className="badge badge-amber">Estudo Ambiental</span>;
      default:
        return <span className="badge badge-blue">{tipo}</span>;
    }
  };

  // Export Inventory to Excel
  const handleExportExcel = () => {
    if (documents.length === 0) {
      alert('Não há documentos cadastrados para exportar.');
      return;
    }
    const rows = filteredDocs.map(d => ({
      'Nomenclatura do Documento': d.nome,
      'Empreendimento BESS': d.projectName,
      'Tipo de Documento': d.tipo,
      'Status': d.status,
      'Número do Protocolo': d.numeroProtocolo || 'N/A',
      'Data de Emissão': d.dataEmissao || 'N/A',
      'Data de Validade': d.dataValidade || 'N/A',
      'Informações Relevantes / Observações': d.observacoes || '',
      'Nome do Arquivo Original': d.nomeArquivoOriginal || '',
      'Cadastrado Por': d.cadastradoPor || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Documentos BESS');
    XLSX.writeFile(workbook, `Documentos_Licenciamento_BESS_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* 1. Top Header Banner & Stats */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={22} style={{ color: 'var(--brasol-teal)' }} />
              Gestão Documental de Licenciamento BESS
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
              Repositório central de certidões CUOS, dispensas, estudos ambientais e arquivos geoespaciais
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {documents.length > 0 && (
              <button 
                className="btn btn-outline" 
                style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                onClick={() => {
                  if (window.confirm('Tem certeza de que deseja apagar TODOS os documentos do repositório?')) {
                    onClearAllDocuments();
                  }
                }}
              >
                <Trash2 size={16} /> Apagar Todos os Documentos
              </button>
            )}

            <button className="btn btn-outline" onClick={handleExportExcel}>
              <Download size={16} /> Exportar Inventário (.xlsx)
            </button>
            <button className="btn btn-primary" onClick={() => onOpenNewDocument()}>
              <Plus size={16} /> Cadastrar Novo Documento
            </button>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL DE DOCUMENTOS</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{documents.length}</div>
          </div>

          <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>CERTIDÕES CUOS</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ecobrasil-green)' }}>
              {documents.filter(d => d.tipo === 'CUOS').length}
            </div>
          </div>

          <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>EM ANÁLISE NO ÓRGÃO</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brasol-teal)' }}>
              {documents.filter(d => d.status === 'Em Análise').length}
            </div>
          </div>

          <div style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>VÁLIDOS & EMITIDOS</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#059669' }}>
              {documents.filter(d => d.status === 'Emitido / Válido').length}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Controls & Search Bar */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Search Box */}
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nomenclatura, protocolo, palavra-chave ou resumo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="filters-group">
            {/* Filter by Project */}
            <select
              className="select-filter"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
            >
              <option value="all">Todos os Empreendimentos</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>

            {/* Filter by Type */}
            <select
              className="select-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Todas as Categorias</option>
              <option value="CUOS">CUOS (Uso do Solo)</option>
              <option value="Certidão / Licença">Licença / Dispensa</option>
              <option value="Estudo Ambiental">Estudo Ambiental</option>
              <option value="KMZ / Geoespacial">KMZ / Geoespacial</option>
              <option value="Parecer Técnico">Parecer Técnico</option>
            </select>

            {/* Filter by Status */}
            <select
              className="select-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos os Status</option>
              <option value="Emitido / Válido">Emitido / Válido</option>
              <option value="Em Análise">Em Análise</option>
              <option value="Pendente">Pendente</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Main Documents Table */}
      <div className="glass-panel main-table-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
            Lista de Documentos Regulatórios ({filteredDocs.length})
          </h4>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Exibindo {filteredDocs.length} de {documents.length} arquivos cadastrados
          </span>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>Nomenclatura do Documento</th>
                <th>Empreendimento BESS</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Protocolo / Processo</th>
                <th>Emissão / Validade</th>
                <th>Baixar Arquivo Original</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                      <FileText size={36} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
                      <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Nenhum documento cadastrado no momento.</strong>
                      <p style={{ fontSize: '0.825rem', maxWidth: '420px', margin: '0 auto' }}>
                        Clique no botão <strong>"+ Cadastrar Novo Documento"</strong> para adicionar manualmente arquivos, certidões CUOS e pareceres aos empreendimentos BESS.
                      </p>
                      <button 
                        className="btn btn-primary" 
                        style={{ marginTop: '0.5rem' }}
                        onClick={() => onOpenNewDocument()}
                      >
                        <Plus size={16} /> Cadastrar Primeiro Documento
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => {
                  const isExpanded = expandedDocId === doc.id;
                  const originalFileName = doc.nomeArquivoOriginal || `${doc.nome}.pdf`;

                  return (
                    <React.Fragment key={doc.id}>
                      <tr>
                        <td>
                          <button
                            className="btn-icon"
                            style={{ padding: '0.25rem' }}
                            onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                            title="Ver detalhes e observações completas"
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                        </td>

                        <td style={{ fontWeight: 700, maxWidth: '280px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                              {doc.nome}
                            </span>
                            {doc.cadastradoPor && (
                              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                                Cadastrado por: {doc.cadastradoPor}
                              </span>
                            )}
                          </div>
                        </td>

                        <td>
                          <span style={{ fontWeight: 600, color: 'var(--brasol-teal)', fontSize: '0.85rem' }}>
                            <Building size={12} style={{ display: 'inline', marginRight: '4px' }} />
                            {doc.projectName}
                          </span>
                        </td>

                        <td>{getTypeBadge(doc.tipo)}</td>

                        <td>{getStatusBadge(doc.status)}</td>

                        <td style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                          {doc.numeroProtocolo || 'N/A'}
                        </td>

                        <td style={{ fontSize: '0.775rem' }}>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>Emissão: {doc.dataEmissao || 'N/A'}</span>
                            {doc.dataValidade && (
                              <span style={{ color: 'var(--text-muted)' }}>Validade: {doc.dataValidade}</span>
                            )}
                          </div>
                        </td>

                        <td>
                          <button
                            onClick={() => downloadBESSFile(originalFileName, doc.nome, doc.observacoes)}
                            className="btn btn-outline"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', gap: '0.3rem' }}
                            title={`Baixar ${originalFileName}`}
                          >
                            <Paperclip size={12} /> {originalFileName}
                          </button>
                        </td>

                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                            <button
                              className="btn-icon"
                              onClick={() => onEditDocument(doc)}
                              title="Editar Documento"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              className="btn-icon"
                              style={{ color: '#dc2626' }}
                              onClick={() => {
                                if (window.confirm(`Confirma a exclusão do documento "${doc.nome}"?`)) {
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

                      {/* Expanded View with Full Notes & Metadata */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={9} className="row-expandable">
                            <div style={{ background: 'var(--bg-card)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                              <h5 style={{ color: 'var(--brasol-teal)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Info size={16} /> Resumo & Informações Relevantes sobre o Arquivo
                              </h5>
                              <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                                {doc.observacoes || 'Sem observações técnicas adicionais fornecidas no momento do cadastro.'}
                              </p>

                              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '1.5rem', fontSize: '0.775rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                                <span>• <strong>Identificador Interno:</strong> {doc.id}</span>
                                <span>• <strong>Data de Cadastro:</strong> {doc.dataCadastro || 'Recente'}</span>
                                <span>• <strong>Nomenclatura do Arquivo Original:</strong> {originalFileName}</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
