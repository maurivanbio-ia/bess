import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BESSProject } from '../data/bessData';

export const exportProjectToPDF = (project: BESSProject) => {
  const doc = new jsPDF();

  // Cabeçalho / Título
  doc.setFontSize(22);
  doc.setTextColor(2, 132, 199); // Azul Brasol
  doc.text('Dossiê do Empreendimento BESS', 14, 22);
  
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // Texto primário
  doc.text(`${project.nome} - ${project.uf}`, 14, 32);

  // Informações Gerais (Tabela 1)
  doc.setFontSize(14);
  doc.setTextColor(2, 132, 199);
  doc.text('1. Informações Gerais', 14, 45);

  autoTable(doc, {
    startY: 50,
    head: [['Propriedade', 'Valor']],
    body: [
      ['Empreendimento', project.nome],
      ['Estado (UF)', project.uf],
      ['Área', `${project.area_ha} ha`],
      ['Potência (MWp)', project.potencia_mwp.toString()],
      ['Órgão Licenciador', project.orgaoLicenciador],
      ['Status Principal', project.status],
    ],
    theme: 'striped',
    headStyles: { fillColor: [2, 132, 199] },
  });

  // Licenças e Certidões (Tabela 2)
  const finalY1 = (doc as any).lastAutoTable.finalY || 50;
  
  doc.setFontSize(14);
  doc.setTextColor(2, 132, 199);
  doc.text('2. Status de Licenças e Certidões', 14, finalY1 + 15);

  autoTable(doc, {
    startY: finalY1 + 20,
    head: [['Licença / Etapa', 'Status', 'Detalhes']],
    body: [
      ['Consulta ao Órgão', project.consultaOrgao ? 'Realizada' : 'Pendente', ''],
      ['Reunião com Órgão', project.reuniaoOrgao ? 'Realizada' : 'Pendente', ''],
      ['Cadastros Básicos', project.cadastrosBasicos ? 'Finalizados' : 'Pendentes', ''],
      ['CUOS (Uso do Solo)', project.cuosStatus, project.cuosDetalhes || '-'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [2, 132, 199] },
  });

  // Tratativas (Tabela 3)
  const finalY2 = (doc as any).lastAutoTable.finalY || finalY1 + 20;

  doc.setFontSize(14);
  doc.setTextColor(2, 132, 199);
  doc.text('3. Histórico de Tratativas', 14, finalY2 + 15);

  if (project.tratativas && project.tratativas.length > 0) {
    const tratativasData = project.tratativas.map(t => [
      t.data,
      t.tipo,
      t.descricao,
      t.responsavel || '-'
    ]);

    autoTable(doc, {
      startY: finalY2 + 20,
      head: [['Data', 'Tipo', 'Descrição', 'Responsável']],
      body: tratativasData,
      theme: 'plain',
      headStyles: { fillColor: [51, 65, 85] }, // Cinza escuro
    });
  } else {
    doc.setFontSize(11);
    doc.setTextColor(100, 116, 139);
    doc.text('Nenhuma tratativa registrada até o momento.', 14, finalY2 + 22);
  }

  // Rodapé
  const pageCount = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.text(
      `Gerado por Plataforma BESS | ${new Date().toLocaleDateString('pt-BR')} - Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  // Download
  doc.save(`Dossie_${project.nome.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
};
