import React, { useState } from 'react';
import { BESSProject, EnvironmentalInteraction } from '../data/bessData';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  ChevronRight, 
  Layers,
  MessageSquare,
  Plus,
  User,
  Building,
  FileText,
  PhoneCall,
  Video,
  Mail,
  FileCheck,
  Pin
} from 'lucide-react';

interface GanttTimelineProps {
  projects: BESSProject[];
  onOpenTratativaModal: (projectId?: string) => void;
}

export const GanttTimeline: React.FC<GanttTimelineProps> = ({ projects, onOpenTratativaModal }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [activeTratativaTooltip, setActiveTratativaTooltip] = useState<EnvironmentalInteraction | null>(null);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'concluido':
        return <span className="badge badge-green"><CheckCircle2 size={12} /> Concluído</span>;
      case 'em_andamento':
        return <span className="badge badge-blue"><Clock size={12} /> Em Andamento</span>;
      case 'cancelado':
        return <span className="badge badge-red"><XCircle size={12} /> Cancelado</span>;
      case 'alerta':
        return <span className="badge badge-amber"><AlertTriangle size={12} /> Alerta</span>;
      default:
        return <span className="badge badge-purple">Pendente</span>;
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Reunião Presencial':
        return <Building size={14} style={{ color: 'var(--brasol-teal)' }} />;
      case 'Reunião Virtual':
        return <Video size={14} style={{ color: '#3b82f6' }} />;
      case 'Atendimento Telefônico':
        return <PhoneCall size={14} style={{ color: '#f59e0b' }} />;
      case 'E-mail Oficial':
        return <Mail size={14} style={{ color: '#8b5cf6' }} />;
      default:
        return <FileText size={14} style={{ color: '#10b981' }} />;
    }
  };

  return (
    <div className="timeline-section" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* 1. Visão Geral do Cronograma (Gantt Macro com Tratativas Marcadas) */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} style={{ color: 'var(--brasol-teal)' }} />
              Cronograma Executivo de Licenciamento (Gantt BESS & Tratativas Marcadas)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Acompanhamento de prazos, etapas críticas, avanço percentual e marcadores de tratativas ambientais
            </p>
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => onOpenTratativaModal(selectedProjectId)}
          >
            <Plus size={16} /> Registrar Tratativa com Órgão
          </button>
        </div>

        {/* Gantt Table */}
        <div className="gantt-table-wrapper">
          <table className="gantt-table">
            <thead>
              <tr>
                <th>Projeto / UF</th>
                <th>Órgão Licenciador</th>
                <th>Início</th>
                <th>Previsão Conclusão</th>
                <th>Progresso & Tratativas Marcadas</th>
                <th>Etapa Atual</th>
                <th>Status Risco</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => {
                const isSelected = proj.id === selectedProjectId;
                const isCancelled = proj.statusCategoria === 'Cancelado por Opção da Brasol';
                const tratativasCount = proj.tratativas?.length || 0;

                return (
                  <tr 
                    key={proj.id}
                    onClick={() => setSelectedProjectId(proj.id)}
                    style={{ 
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(2, 132, 199, 0.08)' : 'transparent',
                      borderLeft: isSelected ? '3px solid var(--brasol-teal)' : 'none'
                    }}
                  >
                    <td style={{ fontWeight: 700 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>{proj.nome}</span>
                        {isSelected && <ChevronRight size={14} style={{ color: 'var(--brasol-teal)' }} />}
                      </div>
                    </td>
                    <td>{proj.orgaoLicenciador}</td>
                    <td>{proj.dataInicio}</td>
                    <td>{proj.dataPrevisaoConclusao}</td>
                    
                    {/* Visual Progress Bar with Tratativas Pins */}
                    <td style={{ width: '220px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div className="progress-bar-bg" style={{ position: 'relative', height: '10px' }}>
                            <div 
                              className="progress-bar-fill" 
                              style={{ 
                                width: `${proj.progressoPct}%`,
                                background: isCancelled 
                                  ? '#ef4444' 
                                  : proj.progressoPct === 100 
                                    ? '#059669' 
                                    : 'linear-gradient(90deg, #0369a1 0%, #059669 100%)'
                              }} 
                            />
                          </div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, minWidth: '35px' }}>
                            {proj.progressoPct}%
                          </span>
                        </div>

                        {/* Tratativas Pin Indicator */}
                        {tratativasCount > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'var(--brasol-teal)', fontWeight: 600 }}>
                            <MessageSquare size={11} /> {tratativasCount} tratativa(s) registrada(s)
                          </div>
                        )}
                      </div>
                    </td>

                    <td style={{ fontSize: '0.8rem' }}>
                      <span style={{ color: isCancelled ? '#dc2626' : undefined, fontWeight: isCancelled ? 700 : 400 }}>
                        {proj.etapaAtual}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        proj.nivelRisco === 'Baixo' ? 'badge-green' :
                        proj.nivelRisco === 'Médio' ? 'badge-blue' :
                        proj.nivelRisco === 'Alto' ? 'badge-amber' : 'badge-red'
                      }`}>
                        {proj.nivelRisco} Risco
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Linha do Tempo de Etapas & Tratativas Marcadas do Projeto Selecionado */}
      {selectedProject && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          
          {/* Coluna Esquerda: Stepper de Etapas Ambientais */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} style={{ color: 'var(--ecobrasil-green)' }} />
                Etapas de Licenciamento: {selectedProject.nome}
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Marcos regulatórios e situação da CUOS
              </p>
            </div>

            {/* Stepper */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {selectedProject.etapas.map((step, idx) => {
                const isCompleted = step.status === 'concluido';
                const isCurrent = step.status === 'em_andamento';
                const isCancelled = step.status === 'cancelado';

                return (
                  <div key={step.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div 
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        flexShrink: 0,
                        background: isCompleted ? 'var(--ecobrasil-green)' : isCancelled ? '#dc2626' : isCurrent ? 'var(--brasol-teal)' : 'var(--bg-main)',
                        color: isCompleted || isCancelled || isCurrent ? '#fff' : 'var(--text-secondary)',
                        border: '2px solid var(--border-color)'
                      }}
                    >
                      {isCompleted ? <CheckCircle2 size={16} /> : isCancelled ? <XCircle size={16} /> : idx + 1}
                    </div>

                    <div style={{ flex: 1, background: 'var(--bg-main)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{step.nome}</strong>
                        {getStatusBadge(step.status)}
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {step.dataConclusao ? `Concluído em: ${step.dataConclusao}` : `Previsão: ${step.dataPrevista}`}
                      </span>
                      {step.observacao && (
                        <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                          {step.observacao}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coluna Direita: Tratativas com o Órgão Ambiental Marcadas na Linha do Tempo */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={18} style={{ color: 'var(--brasol-teal)' }} />
                  Tratativas Ambientais Marcadas ({selectedProject.orgaoLicenciador})
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Histórico de contatos com atendente, horário, data e resumo da tratativa
                </p>
              </div>

              <button 
                className="btn btn-outline"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.775rem' }}
                onClick={() => onOpenTratativaModal(selectedProject.id)}
              >
                <Plus size={14} /> Nova Tratativa
              </button>
            </div>

            {/* Tratativas Timeline Feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '520px', overflowY: 'auto' }}>
              {(!selectedProject.tratativas || selectedProject.tratativas.length === 0) ? (
                <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <MessageSquare size={32} style={{ color: 'var(--text-muted)', opacity: 0.4, marginBottom: '0.5rem' }} />
                  <div>Nenhuma tratativa registrada para este empreendimento ainda.</div>
                  <button 
                    className="btn btn-primary" 
                    style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}
                    onClick={() => onOpenTratativaModal(selectedProject.id)}
                  >
                    <Plus size={14} /> Registrar Primeira Tratativa
                  </button>
                </div>
              ) : (
                selectedProject.tratativas.map((t) => (
                  <div 
                    key={t.id}
                    style={{
                      background: 'var(--bg-main)',
                      padding: '1rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-color)',
                      borderLeft: '4px solid var(--brasol-teal)'
                    }}
                  >
                    {/* Header line */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {getTipoIcon(t.tipo)}
                        <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                          {t.tipo}
                        </strong>
                      </div>

                      <span className={`badge ${
                        t.statusTratativa === 'Concluído' ? 'badge-green' : 'badge-amber'
                      }`} style={{ fontSize: '0.65rem' }}>
                        {t.statusTratativa}
                      </span>
                    </div>

                    {/* Meta info line */}
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={12} /> {t.data}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} /> {t.horario}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <User size={12} /> Atendente: <strong style={{ color: 'var(--text-primary)' }}>{t.atendente}</strong>
                      </span>
                    </div>

                    {/* Resumo */}
                    <p style={{ fontSize: '0.825rem', color: 'var(--text-primary)', lineHeight: '1.45', background: 'var(--bg-card)', padding: '0.65rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
                      {t.resumo}
                    </p>

                    {t.observacoes && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem', fontStyle: 'italic' }}>
                        Obs: {t.observacoes}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
