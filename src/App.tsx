import React, { useState, useEffect } from 'react';
import { INITIAL_BESS_PROJECTS, BESSProject, EnvironmentalInteraction, BESSDocument } from './data/bessData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { KPICards } from './components/KPICards';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { GanttTimeline } from './components/GanttTimeline';
import { ProcessTable } from './components/ProcessTable';
import { ProcessModal } from './components/ProcessModal';
import { TratativaModal } from './components/TratativaModal';
import { DocumentManager } from './components/DocumentManager';
import { DocumentModal } from './components/DocumentModal';
import { Geoportal } from './components/Geoportal';
import { Footer } from './components/Footer';

import { 
  Download, 
  Info,
  MessageSquare,
  FileText
} from 'lucide-react';
import * as XLSX from 'xlsx';

export const App: React.FC = () => {
  // Projects state initialized with local storage or initial datasets
  const [projects, setProjects] = useState<BESSProject[]>(() => {
    const saved = localStorage.getItem('brasol_bess_projects');
    return saved ? JSON.parse(saved) : INITIAL_BESS_PROJECTS;
  });

  // Extract all initial documents from projects for documents state
  const initialDocsList = INITIAL_BESS_PROJECTS.flatMap(p => p.documentosList || []);

  const [documents, setDocuments] = useState<BESSDocument[]>(() => {
    const savedDocs = localStorage.getItem('brasol_bess_documents');
    return savedDocs ? JSON.parse(savedDocs) : initialDocsList;
  });

  // Default theme is 'light' (fundo branco) per user requirement
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'geoportal' | 'gantt' | 'table' | 'documents' | 'report'>('dashboard');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [ufFilter, setUfFilter] = useState('all');
  const [organFilter, setOrganFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Process Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<BESSProject | null>(null);

  // Tratativa Modal State
  const [isTratativaModalOpen, setIsTratativaModalOpen] = useState(false);
  const [defaultTratativaProjId, setDefaultTratativaProjId] = useState<string | undefined>(undefined);

  // Document Modal State
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<BESSDocument | null>(null);
  const [defaultDocProjId, setDefaultDocProjId] = useState<string | undefined>(undefined);

  // Sync projects with localStorage
  useEffect(() => {
    localStorage.setItem('brasol_bess_projects', JSON.stringify(projects));
  }, [projects]);

  // Sync documents with localStorage
  useEffect(() => {
    localStorage.setItem('brasol_bess_documents', JSON.stringify(documents));
  }, [documents]);

  // Apply Theme Attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setUfFilter('all');
    setOrganFilter('all');
    setStatusFilter('all');
  };

  // Filter Projects Logic
  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.situacaoLicenciamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.orgaoLicenciador.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUf = ufFilter === 'all' || p.uf === ufFilter;
    const matchesOrgan = organFilter === 'all' || p.orgaoLicenciador === organFilter;
    const matchesStatus = statusFilter === 'all' || p.statusCategoria === statusFilter;

    return matchesSearch && matchesUf && matchesOrgan && matchesStatus;
  });

  // Save/Update BESS Project
  const handleSaveProject = (updatedProject: BESSProject) => {
    setProjects(prev => {
      const exists = prev.some(p => p.id === updatedProject.id);
      if (exists) {
        return prev.map(p => p.id === updatedProject.id ? updatedProject : p);
      }
      return [updatedProject, ...prev];
    });
  };

  // Save New Environmental Interaction / Tratativa
  const handleSaveTratativa = (projectId: string, newTratativa: EnvironmentalInteraction) => {
    setProjects(prev => {
      return prev.map(p => {
        if (p.id === projectId) {
          const updatedTratativas = [newTratativa, ...(p.tratativas || [])];
          return { ...p, tratativas: updatedTratativas };
        }
        return p;
      });
    });
  };

  // Save / Update Document
  const handleSaveDocument = (doc: BESSDocument) => {
    setDocuments(prev => {
      const exists = prev.some(d => d.id === doc.id);
      if (exists) {
        return prev.map(d => d.id === doc.id ? doc : d);
      }
      return [doc, ...prev];
    });
  };

  // Delete Document
  const handleDeleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
  };

  const handleOpenEdit = (project: BESSProject) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenTratativaModal = (projId?: string) => {
    setDefaultTratativaProjId(projId);
    setIsTratativaModalOpen(true);
  };

  const handleOpenNewDoc = (projId?: string) => {
    setEditingDoc(null);
    setDefaultDocProjId(projId);
    setIsDocModalOpen(true);
  };

  const handleOpenEditDoc = (doc: BESSDocument) => {
    setEditingDoc(doc);
    setIsDocModalOpen(true);
  };

  // Export Data to Excel (.xlsx)
  const handleExportData = () => {
    const exportRows = filteredProjects.map(p => ({
      'Projeto': p.nome,
      'UF': p.uf,
      'CUOS (Certidão de Uso e Ocupação do Solo)': p.cuosStatus,
      'Detalhes CUOS / EVU': p.cuosDetalhes || '',
      'Órgão Licenciador': p.orgaoLicenciador,
      'Área (Hectares)': p.areaHectares || 'N/A',
      'Área (m²)': p.areaM2 || 'N/A',
      'Arquivo KMZ': p.kmzFileName || '',
      'Consulta ao Órgão Ambiental': p.consultaOrgao,
      'Cadastros': p.cadastros,
      'Reunião com Órgão Ambiental': p.reuniaoOrgao,
      'Situação do Licenciamento': p.situacaoLicenciamento,
      'Categoria Status': p.statusCategoria,
      'Nível de Risco': p.nivelRisco,
      'Capacidade (MWp)': p.potenciaMWp || 0,
      'Total Tratativas Registradas': p.tratativas?.length || 0,
      'Total Documentos Cadastrados': documents.filter(d => d.projectId === p.id).length,
      'Progresso (%)': p.progressoPct,
      'Data Início': p.dataInicio,
      'Previsão Conclusão': p.dataPrevisaoConclusao
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Licenciamento BESS');
    XLSX.writeFile(workbook, `Resumo_Licenciamento_BESS_Brasol_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="app-container">
      {/* Strategic Co-branded Header with capa.png Background Image */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenNewModal={handleOpenNew}
        onExportData={handleExportData}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onResetFilters={handleResetFilters}
      />

      {/* Main Body Layout with Sidebar Menu */}
      <div className="app-body-layout">
        
        {/* Left Sidebar Menu */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          documentsCount={documents.length}
          projectsCount={filteredProjects.length}
          onOpenNewDoc={handleOpenNewDoc}
          onOpenNewTratativa={handleOpenTratativaModal}
        />

        {/* Right Main Content Area */}
        <main className="main-content-layout">

          {/* Global Informative Banner */}
          <div style={{ background: 'rgba(2, 132, 199, 0.08)', border: '1px solid rgba(2, 132, 199, 0.2)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={16} style={{ color: 'var(--brasol-teal)', flexShrink: 0 }} />
              <span>
                <strong>Glossário Regulatório:</strong> <strong>CUOS</strong> = <em>Certidão de Uso e Ocupação do Solo</em> (Conformidade urbanística municipal).
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-outline"
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                onClick={() => handleOpenNewDoc()}
              >
                <FileText size={13} /> + Novo Documento
              </button>
              <button 
                className="btn btn-outline"
                style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}
                onClick={() => handleOpenTratativaModal()}
              >
                <MessageSquare size={13} /> + Nova Tratativa
              </button>
            </div>
          </div>

          {/* Tab 1: Dashboard Geral */}
          {activeTab === 'dashboard' && (
            <div>
              <KPICards projects={filteredProjects} />
              <AnalyticsCharts projects={filteredProjects} isDarkMode={theme === 'dark'} />
              
              {/* Quick Process Matrix Overview */}
              <ProcessTable
                projects={filteredProjects}
                ufFilter={ufFilter}
                onUfFilterChange={setUfFilter}
                organFilter={organFilter}
                onOrganFilterChange={setOrganFilter}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                onEditProject={handleOpenEdit}
              />
            </div>
          )}

          {/* Tab 2: Geoportal (KMZ & Spatial Viewer) */}
          {activeTab === 'geoportal' && (
            <div>
              <Geoportal projects={filteredProjects} />
            </div>
          )}

          {/* Tab 3: Cronograma & Linha do Tempo de Tratativas */}
          {activeTab === 'gantt' && (
            <div>
              <GanttTimeline 
                projects={filteredProjects} 
                onOpenTratativaModal={handleOpenTratativaModal}
              />
            </div>
          )}

          {/* Tab 4: Gestão Documental completa */}
          {activeTab === 'documents' && (
            <div>
              <DocumentManager
                projects={projects}
                documents={documents}
                onOpenNewDocument={handleOpenNewDoc}
                onEditDocument={handleOpenEditDoc}
                onDeleteDocument={handleDeleteDocument}
              />
            </div>
          )}

          {/* Tab 5: Matriz Completa de Processos */}
          {activeTab === 'table' && (
            <div>
              <ProcessTable
                projects={filteredProjects}
                ufFilter={ufFilter}
                onUfFilterChange={setUfFilter}
                organFilter={organFilter}
                onOrganFilterChange={setOrganFilter}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                onEditProject={handleOpenEdit}
              />
            </div>
          )}

          {/* Tab 6: Relatório Executivo & Exportação */}
          {activeTab === 'report' && (
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem' }}>Relatório Executivo de Licenciamento BESS</h2>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Visão consolidada para reuniões de diretoria Brasol & parceiros EcoBrasil
                  </p>
                </div>

                <button className="btn btn-primary" onClick={handleExportData}>
                  <Download size={16} /> Exportar Planilha Excel (.xlsx)
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ color: 'var(--brasol-teal)', marginBottom: '0.5rem' }}>Resumo de Cobertura</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Acompanhamento de <strong>{projects.length} projetos de BESS</strong> em 6 estados estratégicos (SC, MA, RS, CE, PI, MG).
                  </p>
                </div>

                <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ color: 'var(--ecobrasil-green)', marginBottom: '0.5rem' }}>Conformidade CUOS</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <strong>{projects.filter(p => p.cuosStatus.toLowerCase().includes('emitida')).length} certidões CUOS</strong> deferidas e instruindo processos ambientais.
                  </p>
                </div>

                <div style={{ background: 'var(--bg-main)', padding: '1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ color: 'var(--status-amber)', marginBottom: '0.5rem' }}>Documentos Cadastrados</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <strong>{documents.length} documentos regulatórios</strong> cadastrados e catalogados na plataforma.
                  </p>
                </div>
              </div>

              {/* Print / Preview Table */}
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Projeto</th>
                      <th>UF</th>
                      <th>Órgão</th>
                      <th>CUOS (Uso do Solo)</th>
                      <th>Área (ha)</th>
                      <th>Situação do Licenciamento</th>
                      <th>Documentos</th>
                      <th>Progresso</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map(p => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 700 }}>{p.nome}</td>
                        <td>{p.uf}</td>
                        <td>{p.orgaoLicenciador}</td>
                        <td style={{ fontSize: '0.8rem' }}>{p.cuosStatus}</td>
                        <td><strong style={{ color: 'var(--ecobrasil-green)' }}>{p.areaHectares ? `${p.areaHectares} ha` : 'N/A'}</strong></td>
                        <td style={{ fontSize: '0.8rem' }}>{p.situacaoLicenciamento}</td>
                        <td><strong>{documents.filter(d => d.projectId === p.id).length} arquivos</strong></td>
                        <td>{p.progressoPct}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Modal para Cadastro/Edição de Processos */}
      <ProcessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        editingProject={editingProject}
      />

      {/* Modal para Registro de Tratativas com Órgãos */}
      <TratativaModal
        isOpen={isTratativaModalOpen}
        onClose={() => setIsTratativaModalOpen(false)}
        onSaveTratativa={handleSaveTratativa}
        projects={projects}
        defaultProjectId={defaultTratativaProjId}
      />

      {/* Modal para Cadastro/Edição de Documentos */}
      <DocumentModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        onSaveDocument={handleSaveDocument}
        projects={projects}
        defaultProjectId={defaultDocProjId}
        editingDocument={editingDoc}
      />

      {/* Corporate Footer */}
      <Footer />
    </div>
  );
};
