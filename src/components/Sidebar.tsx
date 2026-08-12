import React from 'react';
import { 
  LayoutDashboard, 
  Compass, 
  Calendar, 
  FileText, 
  Table, 
  FileSpreadsheet, 
  MessageSquare, 
  HardDrive,
  ChevronRight,
  Moon,
  Sun
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'dashboard' | 'geoportal' | 'gantt' | 'table' | 'documents' | 'report';
  onTabChange: (tab: 'dashboard' | 'geoportal' | 'gantt' | 'table' | 'documents' | 'report') => void;
  documentsCount: number;
  projectsCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenNewTratativa: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  documentsCount,
  projectsCount,
  theme,
  onToggleTheme,
  onOpenNewTratativa
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Painel Geral & Indicadores',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'geoportal',
      label: 'Geoportal (KMZ & Áreas)',
      icon: Compass,
      badge: 'GIS'
    },
    {
      id: 'gantt',
      label: 'Cronograma & Tratativas',
      icon: Calendar,
      badge: null
    },
    {
      id: 'documents',
      label: 'Documentos & Google Drive',
      icon: HardDrive,
      badge: documentsCount > 0 ? documentsCount.toString() : 'Drive'
    },
    {
      id: 'table',
      label: 'Matriz de Processos',
      icon: Table,
      badge: projectsCount.toString()
    },
    {
      id: 'report',
      label: 'Relatório Executivo',
      icon: FileSpreadsheet,
      badge: null
    }
  ] as const;

  return (
    <aside className="sidebar-container">
      <div className="sidebar-inner">
        
        {/* Navigation Category Label */}
        <div className="sidebar-section-label">
          <span>NAVEGAÇÃO PRINCIPAL</span>
        </div>

        {/* Navigation Menu List */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                className={`sidebar-menu-btn ${isActive ? 'active' : ''}`}
                onClick={() => onTabChange(item.id as any)}
              >
                <div className="sidebar-menu-left">
                  <Icon size={18} className="sidebar-menu-icon" />
                  <span className="sidebar-menu-label">{item.label}</span>
                </div>

                <div className="sidebar-menu-right">
                  {item.badge && (
                    <span className={`sidebar-badge ${isActive ? 'active-badge' : ''}`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight size={14} className="active-arrow" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Quick Action Buttons Section */}
        <div className="sidebar-quick-actions">
          <div className="sidebar-section-label" style={{ marginTop: '1.25rem' }}>
            <span>AÇÕES RÁPIDAS</span>
          </div>



          <button className="sidebar-action-btn secondary" onClick={onOpenNewTratativa}>
            <MessageSquare size={15} /> + Nova Tratativa
          </button>
        </div>

        {/* Sidebar Footer Credit */}
        <div className="sidebar-footer">
          <button 
            className="sidebar-action-btn"
            style={{ marginBottom: '1rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
            onClick={onToggleTheme}
          >
            {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
            {theme === 'light' ? ' Modo Escuro' : ' Modo Claro'}
          </button>
          
          <span>Plataforma BESS v2.4</span>
          <span className="credit">Criado por Maurivan Vaz Ribeiro</span>
        </div>

      </div>
    </aside>
  );
};
