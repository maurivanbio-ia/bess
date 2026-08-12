import React from 'react';
import { BESSProject } from '../data/bessData';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface AnalyticsChartsProps {
  projects: BESSProject[];
  isDarkMode: boolean;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ projects, isDarkMode }) => {
  const textColor = isDarkMode ? '#f8fafc' : '#0f172a';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  // 1. Processos por Órgão Licenciador
  const organCounts: Record<string, number> = {};
  projects.forEach(p => {
    organCounts[p.orgaoLicenciador] = (organCounts[p.orgaoLicenciador] || 0) + 1;
  });

  const organData = {
    labels: Object.keys(organCounts),
    datasets: [
      {
        label: 'Quantidade de Processos BESS',
        data: Object.values(organCounts),
        backgroundColor: [
          '#00b4d8',
          '#10b981',
          '#ef4444',
          '#3b82f6',
          '#8b5cf6',
          '#f59e0b'
        ],
        borderRadius: 6,
      },
    ],
  };

  // 2. Status por Categoria
  const statusCounts: Record<string, number> = {};
  projects.forEach(p => {
    statusCounts[p.statusCategoria] = (statusCounts[p.statusCategoria] || 0) + 1;
  });

  const statusData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: [
          '#10b981', // Dispensa
          '#3b82f6', // Em análise
          '#8b5cf6', // Requerimento
          '#f59e0b', // Aguardando CUOS / Estudos
          '#ef4444'  // Cancelado
        ],
        borderWidth: 2,
        borderColor: isDarkMode ? '#131b2e' : '#ffffff',
      },
    ],
  };

  // 3. Distribuição por UF
  const ufCounts: Record<string, number> = {};
  projects.forEach(p => {
    ufCounts[p.uf] = (ufCounts[p.uf] || 0) + 1;
  });

  const ufData = {
    labels: Object.keys(ufCounts),
    datasets: [
      {
        label: 'Projetos por Estado (UF)',
        data: Object.values(ufCounts),
        backgroundColor: 'rgba(0, 180, 216, 0.75)',
        borderColor: '#00b4d8',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: textColor,
          font: { family: 'Inter', size: 12 }
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
        titleColor: isDarkMode ? '#ffffff' : '#000000',
        bodyColor: isDarkMode ? '#cbd5e1' : '#334155',
        borderColor: isDarkMode ? '#334155' : '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6
      }
    },
    scales: {
      x: {
        ticks: { color: textColor },
        grid: { color: gridColor }
      },
      y: {
        ticks: { color: textColor, stepSize: 1 },
        grid: { color: gridColor },
        beginAtZero: true
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: textColor,
          font: { family: 'Inter', size: 11 }
        }
      }
    }
  };

  return (
    <div className="charts-grid">
      {/* Chart 1: Órgão Licenciador */}
      <div className="glass-panel chart-card">
        <div className="chart-header">
          <h3>Processos por Órgão Licenciador</h3>
        </div>
        <div className="chart-container">
          <Bar data={organData} options={chartOptions} />
        </div>
      </div>

      {/* Chart 2: Status por Categoria */}
      <div className="glass-panel chart-card">
        <div className="chart-header">
          <h3>Distribuição de Status de Licenciamento</h3>
        </div>
        <div className="chart-container">
          <Doughnut data={statusData} options={doughnutOptions} />
        </div>
      </div>

      {/* Chart 3: Distribuição por Estado */}
      <div className="glass-panel chart-card" style={{ gridColumn: 'span 1' }}>
        <div className="chart-header">
          <h3>Projetos BESS por Estado (UF)</h3>
        </div>
        <div className="chart-container">
          <Bar data={ufData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};
