import React from 'react';
import { Plus, Download, Sun, Moon, Search, RefreshCw } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenNewModal: () => void;
  onExportData: () => void;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onResetFilters: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onOpenNewModal,
  onExportData,
  searchTerm,
  onSearchChange,
  onResetFilters
}) => {
  return (
    <header className="header-container">
      <div className="header-inner">
        {/* Left Side: Strategic Logos without 'x' symbol */}
        <div className="header-branding">
          <div className="logos-wrapper">
            <img 
              src="/Logo.png" 
              alt="EcoBrasil" 
              className="logo-img"
              title="EcoBrasil Consultoria Ambiental" 
            />
            <img 
              src="/logobrasol.png" 
              alt="Brasol" 
              className="logo-img"
              title="Brasol Energia" 
            />
          </div>

          <div className="header-title-box">
            <h1>
              Gestão de Licenciamento BESS
            </h1>
            <p className="header-subtitle">
              Acompanhamento Regulatório & Ambiental de Sistemas de Armazenamento de Energia
            </p>
          </div>
        </div>

        {/* Right Side: Global Quick Actions & Controls */}
        <div className="header-actions">
          {/* Quick Search */}
          <div className="search-box" style={{ maxWidth: '240px' }}>
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por projeto..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          {/* Theme Toggle */}
          <button 
            className="btn-icon" 
            onClick={onToggleTheme} 
            title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Refresh / Reset Filters */}
          <button 
            className="btn-icon" 
            onClick={onResetFilters} 
            title="Atualizar e Limpar Filtros"
          >
            <RefreshCw size={18} />
          </button>

          {/* Export Report */}
          <button 
            className="btn btn-secondary" 
            onClick={onExportData}
            title="Exportar Relatório em Excel"
          >
            <Download size={16} />
            Exportar
          </button>

          {/* New BESS Process */}
          <button 
            className="btn btn-primary" 
            onClick={onOpenNewModal}
          >
            <Plus size={16} />
            Novo Processo
          </button>
        </div>
      </div>
    </header>
  );
};
