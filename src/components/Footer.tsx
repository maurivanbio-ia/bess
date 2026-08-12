import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div>
          <p className="footer-credit">
            Criado por Maurivan Vaz Ribeiro
          </p>
          <p style={{ marginTop: '0.2rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Plataforma de Gestão e Acompanhamento do Licenciamento Ambiental de BESS • Brasol & EcoBrasil
          </p>
        </div>

        <div className="footer-badges">
          <span className="badge badge-green" style={{ gap: '0.35rem' }}>
            <ShieldCheck size={13} /> Sistema Conforme Órgãos Ambientais
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Brasol. Todos os direitos reservados.
          </span>
        </div>
      </div>
    </footer>
  );
};
