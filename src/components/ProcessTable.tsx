import React, { useState } from 'react';
import { BESSProject } from '../data/bessData';
import { 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  MapPin, 
  Building, 
  Users, 
  Info,
  Paperclip,
  MessageSquare
} from 'lucide-react';

interface ProcessTableProps {
  projects: BESSProject[];
  ufFilter: string;
  onUfFilterChange: (val: string) => void;
  organFilter: string;
  onOrganFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  onEditProject: (project: BESSProject) => void;
}

export const ProcessTable: React.FC<ProcessTableProps> = ({
  projects,
  ufFilter,
  onUfFilterChange,
  organFilter,
  onOrganFilterChange,
  statusFilter,
  onStatusFilterChange,
  onEditProject
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusCategoryBadge = (categoria: string) => {
    switch (categoria) {
      case 'Dispensa Emitida':
        return <span className="badge badge-green">Certidão Emitida</span>;
      case 'Em Análise':
        return <span className="badge badge-blue">Em Análise Órgão</span>;
      case 'Aguardando Estudos':
        return <span className="badge badge-amber">Aguardando Estudos</span>;
      case 'Aguardando CUOS':
        return <span className="badge badge-purple">Aguardando CUOS</span>;
      case 'Requerimento Realizado':
        return <span className="badge badge-blue">Requerimento Protocolado</span>;
      case 'Cancelado por Opção da Brasol':
        return <span className="badge badge-red">Cancelado por Opção da Brasol</span>;
      default:
        return <span className="badge badge-blue">{categoria}</span>;
    }
  };

  return (
    <div className="glass-panel main-table-panel" style={{ padding: '1.5rem' }}>
      {/* Controls Header */}
      <div className="controls-bar">
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            Matriz de Acompanhamento de Processos BESS
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Exibição detalhada conforme diretrizes regulatórias Brasol & EcoBrasil
          </p>
        </div>

        {/* Filters */}
        <div className="filters-group">
          {/* UF Filter */}
          <select 
            className="select-filter"
            value={ufFilter}
            onChange={(e) => onUfFilterChange(e.target.value)}
          >
            <option value="all">Todos os Estados (UF)</option>
            <option value="SC">Santa Catarina (SC)</option>
            <option value="MA">Maranhão (MA)</option>
            <option value="RS">Rio Grande do Sul (RS)</option>
            <option value="CE">Ceará (CE)</option>
            <option value="PI">Piauí (PI)</option>
            <option value="MG">Minas Gerais (MG)</option>
          </select>

          {/* Órgão Filter */}
          <select 
            className="select-filter"
            value={organFilter}
            onChange={(e) => onOrganFilterChange(e.target.value)}
          >
            <option value="all">Todos os Órgãos</option>
            <option value="IMA-SC">IMA-SC</option>
            <option value="SEMA-MA">SEMA-MA</option>
            <option value="FEPAM-RS">FEPAM-RS</option>
            <option value="SEMACE-CE">SEMACE-CE</option>
            <option value="SEMARH-PI">SEMARH-PI</option>
            <option value="SEMAD-MG">SEMAD-MG</option>
          </select>

          {/* Status Filter */}
          <select 
            className="select-filter"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <option value="all">Todos os Status</option>
            <option value="Dispensa Emitida">Certidão Emitida / Dispensa</option>
            <option value="Em Análise">Em Análise da Secretaria</option>
            <option value="Aguardando Estudos">Aguardando Estudos</option>
            <option value="Aguardando CUOS">Aguardando CUOS</option>
            <option value="Cancelado por Opção da Brasol">Cancelado por Opção da Brasol</option>
          </select>
        </div>
      </div>

      {/* Main Responsive Table */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}></th>
              <th>Projeto</th>
              <th>CUOS (Uso do Solo)</th>
              <th>Órgão Licenciador</th>
              <th>Consulta Órgão</th>
              <th>Cadastros</th>
              <th>Reunião Órgão</th>
              <th>Situação do Licenciamento</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                  Nenhum processo encontrado com os filtros selecionados.
                </td>
              </tr>
            ) : (
              projects.map((proj) => {
                const isExpanded = expandedId === proj.id;
                const isCancelledByBrasol = proj.statusCategoria === 'Cancelado por Opção da Brasol';

                return (
                  <React.Fragment key={proj.id}>
                    <tr>
                      <td>
                        <button 
                          className="btn-icon" 
                          style={{ padding: '0.25rem' }}
                          onClick={() => toggleExpand(proj.id)}
                          title="Expandir/Recolher Detalhes"
                        >
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.925rem', color: 'var(--text-primary)' }}>
                            {proj.nome}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <MapPin size={12} /> {proj.uf} • {proj.areaHectares ? `${proj.areaHectares} ha` : ''} ({proj.potenciaMWp || '--'} MWp)
                          </span>
                        </div>
                      </td>
                      <td style={{ maxWidth: '200px' }}>
                        <span 
                          style={{ 
                            fontSize: '0.8rem', 
                            fontWeight: 600,
                            color: proj.cuosStatus.toLowerCase().includes('emitida') ? 'var(--ecobrasil-green)' : 'var(--status-amber)' 
                          }}
                          title={proj.cuosStatus}
                        >
                          {proj.cuosStatus.length > 45 ? `${proj.cuosStatus.substring(0, 45)}...` : proj.cuosStatus}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-blue">
                          <Building size={12} /> {proj.orgaoLicenciador}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${proj.consultaOrgao === 'Sim' ? 'badge-green' : 'badge-amber'}`}>
                          {proj.consultaOrgao}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-green">
                          {proj.cadastros}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${proj.reuniaoOrgao === 'Sim' ? 'badge-green' : 'badge-amber'}`}>
                          <Users size={12} /> {proj.reuniaoOrgao}
                        </span>
                      </td>
                      <td style={{ maxWidth: '280px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          {getStatusCategoryBadge(proj.statusCategoria)}
                          <span style={{ fontSize: '0.775rem', color: isCancelledByBrasol ? '#dc2626' : 'var(--text-secondary)', fontWeight: isCancelledByBrasol ? 600 : 400 }}>
                            {proj.situacaoLicenciamento}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          className="btn btn-outline"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem' }}
                          onClick={() => onEditProject(proj)}
                          title="Editar Processo BESS"
                        >
                          <Edit3 size={14} /> Editar
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Details Drawer */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={9} className="row-expandable">
                          <div className="expandable-content">
                            {/* Detailed CUOS info */}
                            <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                              <h4 style={{ color: 'var(--brasol-teal)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Info size={15} /> Detalhes da CUOS (Uso e Ocupação do Solo)
                              </h4>
                              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                {proj.cuosDetalhes || proj.cuosStatus}
                              </p>
                            </div>

                            {/* Recent Environmental Agency Interactions */}
                            <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                              <h4 style={{ color: 'var(--ecobrasil-green)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <MessageSquare size={15} /> Tratativas com Órgão Ambiental ({proj.tratativas?.length || 0})
                              </h4>
                              {(!proj.tratativas || proj.tratativas.length === 0) ? (
                                <p style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>Sem tratativas registradas.</p>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                  {proj.tratativas.slice(0, 2).map((t) => (
                                    <div key={t.id} style={{ fontSize: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.35rem' }}>
                                      <strong style={{ color: 'var(--brasol-teal)' }}>{t.data} ({t.horario}) - Atendente: {t.atendente}</strong>
                                      <p style={{ color: 'var(--text-primary)' }}>{t.resumo}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Documents Attached */}
                            <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                              <h4 style={{ color: '#8b5cf6', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <Paperclip size={15} /> Documentação do Licenciamento
                              </h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                {proj.documentos.map((doc, idx) => (
                                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem' }}>
                                    <span style={{ color: 'var(--text-primary)' }}>• {doc.nome}</span>
                                    <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>{doc.status}</span>
                                  </div>
                                ))}
                              </div>
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
  );
};
