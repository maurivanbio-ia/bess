import React, { useState } from 'react';
import { EnvironmentalInteraction, BESSProject } from '../data/bessData';
import { X, Save, MessageSquare, Calendar, Clock, User, Building, FileText } from 'lucide-react';

interface TratativaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTratativa: (projectId: string, tratativa: EnvironmentalInteraction) => void;
  projects: BESSProject[];
  defaultProjectId?: string;
}

export const TratativaModal: React.FC<TratativaModalProps> = ({
  isOpen,
  onClose,
  onSaveTratativa,
  projects,
  defaultProjectId
}) => {
  const [selectedProjId, setSelectedProjId] = useState<string>(defaultProjectId || projects[0]?.id || '');
  const [formData, setFormData] = useState<Partial<EnvironmentalInteraction>>({
    data: new Date().toISOString().split('T')[0],
    horario: '10:00',
    orgao: projects.find(p => p.id === (defaultProjectId || projects[0]?.id))?.orgaoLicenciador || 'IMA-SC',
    atendente: '',
    tipo: 'Reunião Presencial',
    resumo: '',
    statusTratativa: 'Concluído',
    observacoes: '',
    cadastradoPor: 'Brasol Regulatory'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.atendente || !formData.resumo) return;

    const newTratativa: EnvironmentalInteraction = {
      id: `trat-${Date.now()}`,
      data: formData.data || new Date().toISOString().split('T')[0],
      horario: formData.horario || '10:00',
      orgao: formData.orgao || 'Órgão Ambiental',
      atendente: formData.atendente,
      tipo: formData.tipo as any || 'Reunião Presencial',
      resumo: formData.resumo,
      statusTratativa: formData.statusTratativa as any || 'Concluído',
      observacoes: formData.observacoes,
      cadastradoPor: formData.cadastradoPor || 'Brasol Regulatory'
    };

    onSaveTratativa(selectedProjId, newTratativa);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} style={{ color: 'var(--brasol-teal)' }} />
            Registrar Nova Tratativa com Órgão Ambiental
          </h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              
              {/* Projeto BESS */}
              <div className="form-group full-width">
                <label>Empreendimento BESS *</label>
                <select
                  value={selectedProjId}
                  onChange={(e) => {
                    const projId = e.target.value;
                    setSelectedProjId(projId);
                    const p = projects.find(item => item.id === projId);
                    if (p) {
                      setFormData(prev => ({ ...prev, orgao: p.orgaoLicenciador }));
                    }
                  }}
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nome} ({p.orgaoLicenciador} - {p.uf})
                    </option>
                  ))}
                </select>
              </div>

              {/* Data da Tratativa */}
              <div className="form-group">
                <label>Data *</label>
                <input 
                  type="date"
                  required
                  value={formData.data || ''}
                  onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                />
              </div>

              {/* Horário */}
              <div className="form-group">
                <label>Horário *</label>
                <input 
                  type="time"
                  required
                  value={formData.horario || ''}
                  onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                />
              </div>

              {/* Órgão Ambiental */}
              <div className="form-group">
                <label>Órgão Ambiental / Entidade *</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: SEMA-MA / IMA-SC / FEPAM-RS"
                  value={formData.orgao || ''}
                  onChange={(e) => setFormData({ ...formData, orgao: e.target.value })}
                />
              </div>

              {/* Atendente / Técnico do Órgão */}
              <div className="form-group">
                <label>Atendente / Técnico do Órgão *</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Eng. Ricardo Silveira (Parecerista)"
                  value={formData.atendente || ''}
                  onChange={(e) => setFormData({ ...formData, atendente: e.target.value })}
                />
              </div>

              {/* Tipo de Tratativa */}
              <div className="form-group">
                <label>Tipo de Atendimento / Canal *</label>
                <select
                  value={formData.tipo || 'Reunião Presencial'}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                >
                  <option value="Reunião Presencial">Reunião Presencial</option>
                  <option value="Reunião Virtual">Reunião Virtual / Videoconferência</option>
                  <option value="Atendimento Telefônico">Atendimento Telefônico / Ligação</option>
                  <option value="E-mail Oficial">E-mail Oficial</option>
                  <option value="Protocolo / Ofício">Protocolo / Ofício Documental</option>
                  <option value="Vistoria">Vistoria Técnico-Ambiental</option>
                </select>
              </div>

              {/* Status da Tratativa */}
              <div className="form-group">
                <label>Status da Tratativa</label>
                <select
                  value={formData.statusTratativa || 'Concluído'}
                  onChange={(e) => setFormData({ ...formData, statusTratativa: e.target.value as any })}
                >
                  <option value="Concluído">Concluído</option>
                  <option value="Em Acompanhamento">Em Acompanhamento</option>
                  <option value="Pendente Resposta Órgão">Pendente Resposta do Órgão</option>
                </select>
              </div>

              {/* Resumo da Tratativa Realizada */}
              <div className="form-group full-width">
                <label>Resumo Detalhado da Tratativa Realizada *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Descreva o que foi discutido, orientações do técnico do órgão, alinhamentos de estudos ou andamento do processo..."
                  value={formData.resumo || ''}
                  onChange={(e) => setFormData({ ...formData, resumo: e.target.value })}
                />
              </div>

              {/* Observações Adicionais */}
              <div className="form-group full-width">
                <label>Informações Importantes Adicionais / Prazos de Retorno</label>
                <textarea
                  rows={2}
                  placeholder="Compromissos assumidos, documentos a enviar ou observações críticas..."
                  value={formData.observacoes || ''}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Salvar Tratativa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
