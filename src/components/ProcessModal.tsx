import React, { useState, useEffect } from 'react';
import { BESSProject } from '../data/bessData';
import { X, Save, Building, MapPin, Zap } from 'lucide-react';

interface ProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: BESSProject) => void;
  editingProject?: BESSProject | null;
}

export const ProcessModal: React.FC<ProcessModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProject
}) => {
  const [formData, setFormData] = useState<Partial<BESSProject>>({
    nome: '',
    municipio: '',
    uf: 'SC',
    orgaoLicenciador: 'IMA-SC',
    cuosStatus: 'Emitida',
    cuosDetalhes: '',
    consultaOrgao: 'Sim',
    cadastros: 'Realizado',
    reuniaoOrgao: 'Não',
    situacaoLicenciamento: 'Requerimento realizado',
    statusCategoria: 'Em Análise',
    nivelRisco: 'Baixo',
    etapaAtual: 'Requerimento',
    progressoPct: 50,
    potenciaMWp: 30,
    investimentoEstimadoMilhoes: 45
  });

  useEffect(() => {
    if (editingProject) {
      setFormData(editingProject);
    } else {
      setFormData({
        id: `bess-${Date.now()}`,
        nome: '',
        municipio: '',
        uf: 'SC',
        orgaoLicenciador: 'IMA-SC',
        cuosStatus: 'Emitida',
        cuosDetalhes: '',
        consultaOrgao: 'Sim',
        cadastros: 'Realizado',
        reuniaoOrgao: 'Não',
        situacaoLicenciamento: 'Requerimento realizado',
        statusCategoria: 'Em Análise',
        nivelRisco: 'Baixo',
        etapaAtual: 'Análise Técnica',
        progressoPct: 50,
        potenciaMWp: 30,
        investimentoEstimadoMilhoes: 45,
        dataInicio: new Date().toISOString().split('T')[0],
        dataPrevisaoConclusao: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
        etapas: [
          { id: 'e1', nome: 'Consulta Prévia ao Órgão', status: 'concluido', dataPrevista: new Date().toISOString().split('T')[0] },
          { id: 'e2', nome: 'Cadastros no Sistema', status: 'concluido', dataPrevista: new Date().toISOString().split('T')[0] },
          { id: 'e3', nome: 'Emissão da CUOS', status: 'concluido', dataPrevista: new Date().toISOString().split('T')[0] },
          { id: 'e4', nome: 'Análise de Requerimento', status: 'em_andamento', dataPrevista: new Date().toISOString().split('T')[0] },
          { id: 'e5', nome: 'Emissão da Dispensa / Licença', status: 'pendente', dataPrevista: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0] }
        ],
        historico: [
          { data: new Date().toISOString().split('T')[0], autor: 'Brasol Regulatory', acao: 'Processo Criado', detalhe: 'Cadastro inicial do BESS na plataforma.' }
        ],
        documentos: [
          { nome: 'Documentacao_Inicial_BESS.pdf', tipo: 'Projeto Técnico', status: 'Em Análise' }
        ]
      });
    }
  }, [editingProject, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome) return;

    onSave(formData as BESSProject);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Building size={20} style={{ color: '#00b4d8' }} />
            {editingProject ? 'Editar Processo BESS' : 'Cadastrar Novo Processo BESS'}
          </h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              {/* Nome do Projeto */}
              <div className="form-group full-width">
                <label>Nome do Projeto BESS *</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Jardim da Serra - SC"
                  value={formData.nome || ''}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>

              {/* UF */}
              <div className="form-group">
                <label>Estado (UF) *</label>
                <select
                  value={formData.uf || 'SC'}
                  onChange={(e) => setFormData({ ...formData, uf: e.target.value as any })}
                >
                  <option value="SC">Santa Catarina (SC)</option>
                  <option value="MA">Maranhão (MA)</option>
                  <option value="RS">Rio Grande do Sul (RS)</option>
                  <option value="CE">Ceará (CE)</option>
                  <option value="PI">Piauí (PI)</option>
                  <option value="MG">Minas Gerais (MG)</option>
                </select>
              </div>

              {/* Órgão Licenciador */}
              <div className="form-group">
                <label>Órgão Licenciador *</label>
                <select
                  value={formData.orgaoLicenciador || 'IMA-SC'}
                  onChange={(e) => setFormData({ ...formData, orgaoLicenciador: e.target.value })}
                >
                  <option value="IMA-SC">IMA-SC</option>
                  <option value="SEMA-MA">SEMA-MA</option>
                  <option value="FEPAM-RS">FEPAM-RS</option>
                  <option value="SEMACE-CE">SEMACE-CE</option>
                  <option value="SEMARH-PI">SEMARH-PI</option>
                  <option value="SEMAD-MG">SEMAD-MG</option>
                </select>
              </div>

              {/* CUOS Status */}
              <div className="form-group full-width">
                <label>Status da Certidão de Uso do Solo (CUOS) *</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Emitida / Solicitada, aguardando análise"
                  value={formData.cuosStatus || ''}
                  onChange={(e) => setFormData({ ...formData, cuosStatus: e.target.value })}
                />
              </div>

              {/* CUOS Detalhes */}
              <div className="form-group full-width">
                <label>Observações / Condicionantes Urbanísticas (EVU, Anuência, etc.)</label>
                <textarea
                  rows={2}
                  placeholder="Detalhes adicionais sobre exigências ambientais ou urbanísticas..."
                  value={formData.cuosDetalhes || ''}
                  onChange={(e) => setFormData({ ...formData, cuosDetalhes: e.target.value })}
                />
              </div>

              {/* Consulta Órgão */}
              <div className="form-group">
                <label>Consulta ao Órgão Ambiental</label>
                <select
                  value={formData.consultaOrgao || 'Sim'}
                  onChange={(e) => setFormData({ ...formData, consultaOrgao: e.target.value as any })}
                >
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
              </div>

              {/* Reunião Órgão */}
              <div className="form-group">
                <label>Reunião com o Órgão Ambiental</label>
                <select
                  value={formData.reuniaoOrgao || 'Não'}
                  onChange={(e) => setFormData({ ...formData, reuniaoOrgao: e.target.value as any })}
                >
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
              </div>

              {/* Situação do Licenciamento */}
              <div className="form-group full-width">
                <label>Situação Atual do Licenciamento *</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Certidão de dispensa emitida"
                  value={formData.situacaoLicenciamento || ''}
                  onChange={(e) => setFormData({ ...formData, situacaoLicenciamento: e.target.value })}
                />
              </div>

              {/* Categoria de Status */}
              <div className="form-group">
                <label>Categoria de Status</label>
                <select
                  value={formData.statusCategoria || 'Em Análise'}
                  onChange={(e) => setFormData({ ...formData, statusCategoria: e.target.value as any })}
                >
                  <option value="Dispensa Emitida">Dispensa Emitida / Certidão</option>
                  <option value="Em Análise">Em Análise no Órgão</option>
                  <option value="Aguardando Estudos">Aguardando Estudos</option>
                  <option value="Aguardando CUOS">Aguardando CUOS</option>
                  <option value="Requerimento Realizado">Requerimento Protocolado</option>
                  <option value="Cancelado">Cancelado por Opção</option>
                </select>
              </div>

              {/* Nível de Risco */}
              <div className="form-group">
                <label>Nível de Risco Ambiental</label>
                <select
                  value={formData.nivelRisco || 'Baixo'}
                  onChange={(e) => setFormData({ ...formData, nivelRisco: e.target.value as any })}
                >
                  <option value="Baixo">Baixo Risco</option>
                  <option value="Médio">Médio Risco</option>
                  <option value="Alto">Alto Risco</option>
                  <option value="Crítico">Crítico</option>
                </select>
              </div>

              {/* Potência MWp */}
              <div className="form-group">
                <label>Capacidade (MWp)</label>
                <input 
                  type="number"
                  placeholder="Ex: 30"
                  value={formData.potenciaMWp || 0}
                  onChange={(e) => setFormData({ ...formData, potenciaMWp: Number(e.target.value) })}
                />
              </div>

              {/* Progresso % */}
              <div className="form-group">
                <label>Progresso Estimado (%)</label>
                <input 
                  type="number"
                  min={0}
                  max={100}
                  value={formData.progressoPct || 0}
                  onChange={(e) => setFormData({ ...formData, progressoPct: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Save Processo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
