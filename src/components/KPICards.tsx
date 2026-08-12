import React from 'react';
import { BESSProject } from '../data/bessData';
import { 
  FileCheck2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Zap, 
  Building2,
  FileText
} from 'lucide-react';

interface KPICardsProps {
  projects: BESSProject[];
}

export const KPICards: React.FC<KPICardsProps> = ({ projects }) => {
  const totalProjects = projects.length;
  
  const dispensasEmitidas = projects.filter(
    p => p.statusCategoria === 'Dispensa Emitida' || p.situacaoLicenciamento.toLowerCase().includes('dispensa')
  ).length;

  const emAnalise = projects.filter(
    p => p.statusCategoria === 'Em Análise' || p.statusCategoria === 'Requerimento Realizado' || p.statusCategoria === 'Aguardando Estudos'
  ).length;

  const cuosEmitidas = projects.filter(
    p => p.cuosStatus.toLowerCase().includes('emitida')
  ).length;

  const canceladosOuAlerta = projects.filter(
    p => p.statusCategoria === 'Cancelado' || p.nivelRisco === 'Alto' || p.nivelRisco === 'Crítico'
  ).length;

  const totalPotenciaMWp = projects.reduce((acc, p) => acc + (p.potenciaMWp || 0), 0);
  const totalInvestimento = projects.reduce((acc, p) => acc + (p.investimentoEstimadoMilhoes || 0), 0);

  return (
    <div className="kpi-grid">
      {/* Total Projects Card */}
      <div className="glass-panel kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Projetos BESS</span>
          <div className="kpi-icon-box" style={{ background: 'rgba(0, 180, 216, 0.15)', color: '#00b4d8' }}>
            <Building2 size={20} />
          </div>
        </div>
        <div className="kpi-value">{totalProjects}</div>
        <div className="kpi-footer">
          <Zap size={14} style={{ color: '#00b4d8' }} />
          <span>{totalPotenciaMWp} MWp instalados previstos</span>
        </div>
      </div>

      {/* Dispensas & Licenças Emitidas */}
      <div className="glass-panel kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Dispensas Emitidas</span>
          <div className="kpi-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <FileCheck2 size={20} />
          </div>
        </div>
        <div className="kpi-value">{dispensasEmitidas}</div>
        <div className="kpi-footer">
          <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>
            {totalProjects > 0 ? Math.round((dispensasEmitidas / totalProjects) * 100) : 0}% do portfólio
          </span>
        </div>
      </div>

      {/* Em Análise / Requerimentos */}
      <div className="glass-panel kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Em Análise / Tramitação</span>
          <div className="kpi-icon-box" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
            <Clock size={20} />
          </div>
        </div>
        <div className="kpi-value">{emAnalise}</div>
        <div className="kpi-footer">
          <span>Processos ativos nos órgãos estaduais</span>
        </div>
      </div>

      {/* CUOS Emitidas */}
      <div className="glass-panel kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Certidões CUOS Deferidas</span>
          <div className="kpi-icon-box" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <FileText size={20} />
          </div>
        </div>
        <div className="kpi-value">{cuosEmitidas}</div>
        <div className="kpi-footer">
          <span>Uso do Solo municipal conforme</span>
        </div>
      </div>

      {/* Cancelados / Risco */}
      <div className="glass-panel kpi-card">
        <div className="kpi-header">
          <span className="kpi-title">Cancelados / Alto Risco</span>
          <div className="kpi-icon-box" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <AlertTriangle size={20} />
          </div>
        </div>
        <div className="kpi-value">{canceladosOuAlerta}</div>
        <div className="kpi-footer">
          <span style={{ color: '#ef4444' }}>
            Revisão de viabilidade / EVU exigido
          </span>
        </div>
      </div>
    </div>
  );
};
