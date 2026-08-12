import React, { useState } from 'react';
import { BESSDocument, BESSProject } from '../data/bessData';
import { X, Save, FileText, Upload, Calendar, Building, Tag, FileCheck, Info } from 'lucide-react';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDocument: (document: BESSDocument) => void;
  projects: BESSProject[];
  defaultProjectId?: string;
  editingDocument?: BESSDocument | null;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  onSaveDocument,
  projects,
  defaultProjectId,
  editingDocument
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    editingDocument?.projectId || defaultProjectId || projects[0]?.id || ''
  );

  const [formData, setFormData] = useState<Partial<BESSDocument>>({
    nome: editingDocument?.nome || '',
    tipo: editingDocument?.tipo || 'CUOS',
    status: editingDocument?.status || 'Emitido / Válido',
    dataEmissao: editingDocument?.dataEmissao || new Date().toISOString().split('T')[0],
    dataValidade: editingDocument?.dataValidade || '',
    numeroProtocolo: editingDocument?.numeroProtocolo || '',
    observacoes: editingDocument?.observacoes || '',
    nomeArquivoOriginal: editingDocument?.nomeArquivoOriginal || '',
    cadastradoPor: editingDocument?.cadastradoPor || 'Maurivan Vaz Ribeiro (Brasol)'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !selectedProjectId) return;

    const selectedProj = projects.find(p => p.id === selectedProjectId);

    const newDoc: BESSDocument = {
      id: editingDocument?.id || `doc-${Date.now()}`,
      projectId: selectedProjectId,
      projectName: selectedProj ? selectedProj.nome : 'Empreendimento BESS',
      nome: formData.nome,
      tipo: formData.tipo as any || 'CUOS',
      status: formData.status as any || 'Emitido / Válido',
      dataEmissao: formData.dataEmissao,
      dataValidade: formData.dataValidade,
      numeroProtocolo: formData.numeroProtocolo,
      observacoes: formData.observacoes,
      nomeArquivoOriginal: formData.nomeArquivoOriginal || `${formData.nome.replace(/\s+/g, '_')}.pdf`,
      cadastradoPor: formData.cadastradoPor || 'Maurivan Vaz Ribeiro (Brasol)',
      dataCadastro: new Date().toISOString().split('T')[0]
    };

    onSaveDocument(newDoc);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '780px' }}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} style={{ color: 'var(--brasol-teal)' }} />
            {editingDocument ? 'Editar Cadastro do Documento' : 'Cadastrar Novo Documento de Licenciamento'}
          </h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              
              {/* Empreendimento BESS */}
              <div className="form-group full-width">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Building size={14} style={{ color: 'var(--brasol-teal)' }} />
                  Empreendimento BESS *
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  required
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nome} ({p.orgaoLicenciador} - {p.uf})
                    </option>
                  ))}
                </select>
              </div>

              {/* Nomenclatura / Nome Oficial do Documento */}
              <div className="form-group full-width">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Tag size={14} style={{ color: 'var(--ecobrasil-green)' }} />
                  Nomenclatura do Documento / Título Oficial *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Certidão de Uso e Ocupação do Solo - CUOS nº 452/2024"
                  value={formData.nome || ''}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>

              {/* Tipo de Documento */}
              <div className="form-group">
                <label>Tipo / Categoria *</label>
                <select
                  value={formData.tipo || 'CUOS'}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                >
                  <option value="CUOS">CUOS (Uso e Ocupação do Solo)</option>
                  <option value="Certidão / Licença">Certidão / Licença / Dispensa</option>
                  <option value="Estudo Ambiental">Estudo Ambiental (RAS, RCA, EIA, RIMA)</option>
                  <option value="KMZ / Geoespacial">KMZ / KML / Geoespacial</option>
                  <option value="Parecer Técnico">Parecer Técnico / Ofício</option>
                  <option value="Matrícula Imóvel">Matrícula do Imóvel / Terreno</option>
                  <option value="Outros">Outros Documentos Regulatórios</option>
                </select>
              </div>

              {/* Status do Documento */}
              <div className="form-group">
                <label>Status do Documento *</label>
                <select
                  value={formData.status || 'Emitido / Válido'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="Emitido / Válido">Emitido / Válido</option>
                  <option value="Em Análise">Em Análise no Órgão</option>
                  <option value="Pendente">Pendente de Elaboração / Emissão</option>
                  <option value="Expirado">Expirado / Renovação Necessária</option>
                </select>
              </div>

              {/* Número de Protocolo / Processo */}
              <div className="form-group">
                <label>Número do Protocolo / Processo</label>
                <input
                  type="text"
                  placeholder="Ex: CUOS-2024-0452-JS / FEPAM-8812"
                  value={formData.numeroProtocolo || ''}
                  onChange={(e) => setFormData({ ...formData, numeroProtocolo: e.target.value })}
                />
              </div>

              {/* Data de Emissão */}
              <div className="form-group">
                <label>Data de Emissão / Protocolo</label>
                <input
                  type="date"
                  value={formData.dataEmissao || ''}
                  onChange={(e) => setFormData({ ...formData, dataEmissao: e.target.value })}
                />
              </div>

              {/* Data de Validade */}
              <div className="form-group">
                <label>Data de Validade (se houver)</label>
                <input
                  type="date"
                  value={formData.dataValidade || ''}
                  onChange={(e) => setFormData({ ...formData, dataValidade: e.target.value })}
                />
              </div>

              {/* Nomenclatura / Nome do Arquivo Digital */}
              <div className="form-group">
                <label>Nomenclatura do Arquivo Digital (.pdf, .kmz, etc)</label>
                <input
                  type="text"
                  placeholder="Ex: CUOS_Jardim_da_Serra_IMA_SC.pdf"
                  value={formData.nomeArquivoOriginal || ''}
                  onChange={(e) => setFormData({ ...formData, nomeArquivoOriginal: e.target.value })}
                />
              </div>

              {/* Resumo / Informações Relevantes */}
              <div className="form-group full-width">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Info size={14} style={{ color: 'var(--brasol-teal)' }} />
                  Informações Relevantes / Resumo sobre o Arquivo *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Insira detalhes técnicos, observações de condicionantes, restrições urbanísticas ou informações importantes sobre este documento..."
                  value={formData.observacoes || ''}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                />
              </div>

              {/* Cadastrado por */}
              <div className="form-group full-width">
                <label>Responsável pelo Cadastro</label>
                <input
                  type="text"
                  value={formData.cadastradoPor || ''}
                  onChange={(e) => setFormData({ ...formData, cadastradoPor: e.target.value })}
                />
              </div>

            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Save size={16} /> Salvar Documento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
