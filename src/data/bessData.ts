export interface ProcessStage {
  id: string;
  nome: string;
  status: 'concluido' | 'em_andamento' | 'pendente' | 'cancelado' | 'alerta';
  dataPrevista: string;
  dataConclusao?: string;
  observacao?: string;
}

export interface EnvironmentalInteraction {
  id: string;
  data: string; // YYYY-MM-DD
  horario: string; // HH:mm
  orgao: string;
  atendente: string; // Atendente / Técnico do Órgão
  tipo: 'Reunião Presencial' | 'Reunião Virtual' | 'Atendimento Telefônico' | 'E-mail Oficial' | 'Protocolo / Ofício' | 'Vistoria';
  resumo: string; // Resumo da tratativa realizada
  statusTratativa: 'Concluído' | 'Em Acompanhamento' | 'Pendente Resposta Órgão';
  observacoes?: string;
  cadastradoPor?: string;
}

export interface BESSDocument {
  id: string;
  projectId: string;
  projectName: string;
  nome: string; // Nomenclatura / Nome oficial do arquivo (Manual)
  tipo: 'CUOS' | 'Certidão / Licença' | 'Estudo Ambiental' | 'KMZ / Geoespacial' | 'Parecer Técnico' | 'Matrícula Imóvel' | 'Outros';
  status: 'Emitido / Válido' | 'Em Análise' | 'Pendente' | 'Expirado';
  dataEmissao?: string;
  dataValidade?: string;
  numeroProtocolo?: string;
  observacoes?: string; // Informações relevantes do arquivo
  nomeArquivoOriginal?: string;
  cadastradoPor?: string;
  dataCadastro?: string;
}

export interface BESSProject {
  id: string;
  nome: string;
  municipio: string;
  uf: 'SC' | 'MA' | 'RS' | 'CE' | 'PI' | 'MG';
  cuosStatus: string; // Certidão de Uso e Ocupação do Solo
  cuosDetalhes?: string;
  orgaoLicenciador: string;
  consultaOrgao: 'Sim' | 'Não';
  cadastros: 'Realizado' | 'Em Andamento' | 'Pendente';
  reuniaoOrgao: 'Sim' | 'Não';
  situacaoLicenciamento: string;
  statusCategoria: 'Dispensa Emitida' | 'Em Análise' | 'Aguardando Estudos' | 'Aguardando CUOS' | 'Requerimento Realizado' | 'Cancelado por Opção da Brasol';
  nivelRisco: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
  etapaAtual: string;
  progressoPct: number;
  potenciaMWp?: number;
  areaHectares?: number;
  areaM2?: number;
  kmzFileName?: string;
  centerCoordinates?: [number, number];
  polygonCoordinates?: [number, number][];
  investimentoEstimadoMilhoes?: number;
  dataInicio: string;
  dataPrevisaoConclusao: string;
  etapas: ProcessStage[];
  tratativas: EnvironmentalInteraction[];
  historico: { data: string; autor: string; acao: string; detalhe: string }[];
  documentos: { nome: string; tipo: string; status: 'Aprovado' | 'Em Análise' | 'Pendente' }[];
  documentosList?: BESSDocument[];
}

export const INITIAL_BESS_PROJECTS: BESSProject[] = [
  {
    id: 'bess-001',
    nome: 'Jardim da Serra - SC',
    municipio: 'Jardim da Serra',
    uf: 'SC',
    cuosStatus: 'Emitida',
    cuosDetalhes: 'CUOS nº 452/2024 emitida pela Prefeitura Municipal de Jardim da Serra. Atende normas de zoneamento rural e de utilidade pública para sistemas BESS.',
    orgaoLicenciador: 'IMA-SC',
    consultaOrgao: 'Sim',
    cadastros: 'Realizado',
    reuniaoOrgao: 'Sim',
    situacaoLicenciamento: 'Certidão de dispensa de licenciamento ambiental (DLA) aprovada e emitida pelo IMA-SC.',
    statusCategoria: 'Dispensa Emitida',
    nivelRisco: 'Baixo',
    etapaAtual: 'Emissão da Dispensa Ambiental',
    progressoPct: 100,
    potenciaMWp: 30,
    areaHectares: 8.2,
    areaM2: 82000,
    kmzFileName: '20251001 Serra1 - Áreas de Levantamento.kmz',
    centerCoordinates: [-28.2833, -49.6167],
    polygonCoordinates: [
      [-28.2810, -49.6185],
      [-28.2812, -49.6145],
      [-28.2855, -49.6150],
      [-28.2850, -49.6190]
    ],
    investimentoEstimadoMilhoes: 45.0,
    dataInicio: '2024-01-15',
    dataPrevisaoConclusao: '2024-06-30',
    etapas: [
      { id: 'e1', nome: 'Consulta Prévia ao Órgão', status: 'concluido', dataPrevista: '2024-02-15', dataConclusao: '2024-02-08' },
      { id: 'e2', nome: 'Cadastros nos Sistemas', status: 'concluido', dataPrevista: '2024-03-01', dataConclusao: '2024-02-25' },
      { id: 'e3', nome: 'Emissão da CUOS (Uso e Ocupação do Solo)', status: 'concluido', dataPrevista: '2024-04-15', dataConclusao: '2024-04-10' },
      { id: 'e4', nome: 'Análise de Enquadramento IMA', status: 'concluido', dataPrevista: '2024-05-20', dataConclusao: '2024-05-18' },
      { id: 'e5', nome: 'Emissão da Certidão de Dispensa', status: 'concluido', dataPrevista: '2024-06-30', dataConclusao: '2024-06-25' }
    ],
    tratativas: [
      {
        id: 't-101',
        data: '2026-08-12',
        horario: '10:00',
        orgao: 'IMA-SC',
        atendente: 'Eng. Ricardo Silveira (Parecerista IMA-SC)',
        tipo: 'Reunião Presencial',
        resumo: 'Reunião técnica presencial para alinhamento dos estudos de impacto ambiental. O técnico confirmou a conformidade da CUOS e a emissão oficial da dispensa.',
        statusTratativa: 'Concluído',
        observacoes: 'Tudo de acordo com as normas estaduais.',
        cadastradoPor: 'Brasol Regulatory'
      }
    ],
    historico: [
      { data: '2024-06-25', autor: 'EcoBrasil Team', acao: 'Emissão Concluída', detalhe: 'Certidão de dispensa liberada no portal IMA-SC.' }
    ],
    documentos: [
      { nome: 'CUOS_Jardim_da_Serra.pdf', tipo: 'CUOS', status: 'Aprovado' },
      { nome: 'Dispensa_IMA_SC.pdf', tipo: 'Licença/Dispensa', status: 'Aprovado' }
    ],
    documentosList: [
      {
        id: 'doc-001',
        projectId: 'bess-001',
        projectName: 'Jardim da Serra - SC',
        nome: 'Certidão de Uso e Ocupação do Solo - CUOS nº 452/2024',
        tipo: 'CUOS',
        status: 'Emitido / Válido',
        dataEmissao: '2024-04-10',
        dataValidade: '2026-04-10',
        numeroProtocolo: 'CUOS-2024-0452-JS',
        observacoes: 'Certidão de Uso e Ocupação do Solo emitida pela prefeitura municipal com aceite para instalação do BESS.',
        nomeArquivoOriginal: 'CUOS_Jardim_da_Serra.pdf',
        cadastradoPor: 'Maurivan Vaz Ribeiro (Brasol)',
        dataCadastro: '2024-04-12'
      },
      {
        id: 'doc-002',
        projectId: 'bess-001',
        projectName: 'Jardim da Serra - SC',
        nome: 'Certidão de Dispensa de Licenciamento Ambiental (DLA-IMA)',
        tipo: 'Certidão / Licença',
        status: 'Emitido / Válido',
        dataEmissao: '2024-06-25',
        dataValidade: '2028-06-25',
        numeroProtocolo: 'DLA-IMA-2024-8891',
        observacoes: 'Certidão oficial do IMA-SC liberando a obra do sistema BESS.',
        nomeArquivoOriginal: 'Dispensa_IMA_SC.pdf',
        cadastradoPor: 'EcoBrasil Consultoria',
        dataCadastro: '2024-06-26'
      },
      {
        id: 'doc-003',
        projectId: 'bess-001',
        projectName: 'Jardim da Serra - SC',
        nome: 'Polígono KMZ de Levantamento Perimetral (8.2 ha)',
        tipo: 'KMZ / Geoespacial',
        status: 'Emitido / Válido',
        dataEmissao: '2025-01-10',
        numeroProtocolo: 'GEO-SC-2025-01',
        observacoes: 'Coordenadas perimétricas validadas em campo com área total de 8.2 hectares.',
        nomeArquivoOriginal: '20251001 Serra1 - Áreas de Levantamento.kmz',
        cadastradoPor: 'Maurivan Vaz Ribeiro (Brasol)',
        dataCadastro: '2025-01-11'
      }
    ]
  },
  {
    id: 'bess-002',
    nome: 'São João dos Patos - MA',
    municipio: 'São João dos Patos',
    uf: 'MA',
    cuosStatus: 'Solicitada / Em Análise',
    cuosDetalhes: 'Requerimento de CUOS protocolado na Prefeitura de São João dos Patos. Aguardando parecer de viabilidade da Secretaria Municipal de Meio Ambiente.',
    orgaoLicenciador: 'SEMA-MA',
    consultaOrgao: 'Sim',
    cadastros: 'Realizado',
    reuniaoOrgao: 'Sim',
    situacaoLicenciamento: 'Falta CUOS para emissão do formulário de caracterização do empreendimento (FCE) junto à SEMA-MA.',
    statusCategoria: 'Aguardando CUOS',
    nivelRisco: 'Médio',
    etapaAtual: 'Emissão da CUOS Municipal',
    progressoPct: 45,
    potenciaMWp: 45,
    areaHectares: 12.5,
    areaM2: 125000,
    kmzFileName: '13_Sao.Joao.Patos.kmz',
    centerCoordinates: [-6.4950, -43.7022],
    polygonCoordinates: [
      [-6.4920, -43.7050],
      [-6.4925, -43.6990],
      [-6.4980, -43.7000],
      [-6.4975, -43.7060]
    ],
    investimentoEstimadoMilhoes: 65.0,
    dataInicio: '2024-02-01',
    dataPrevisaoConclusao: '2024-09-30',
    etapas: [
      { id: 'e1', nome: 'Consulta Prévia SEMA-MA', status: 'concluido', dataPrevista: '2024-02-28', dataConclusao: '2024-02-20' },
      { id: 'e2', nome: 'Cadastro no SIGLA/SEMA', status: 'concluido', dataPrevista: '2024-03-15', dataConclusao: '2024-03-10' },
      { id: 'e3', nome: 'Protocolo da CUOS na Prefeitura', status: 'em_andamento', dataPrevista: '2024-04-30' },
      { id: 'e4', nome: 'Apresentação do FCE à SEMA', status: 'pendente', dataPrevista: '2024-07-15' },
      { id: 'e5', nome: 'Obtenção da Licença Prévia', status: 'pendente', dataPrevista: '2024-09-30' }
    ],
    tratativas: [
      {
        id: 't-102',
        data: '2026-08-11',
        horario: '14:30',
        orgao: 'SEMA-MA',
        atendente: 'Dra. Camila Mendes (SEMA-MA)',
        tipo: 'Reunião Virtual',
        resumo: 'Alinhamento virtual sobre a entrega da CUOS. A técnica informou que o FCE pode ser adiantado.',
        statusTratativa: 'Em Acompanhamento',
        observacoes: 'Solicitada agilidade no parecer municipal.',
        cadastradoPor: 'Brasol Regulatory'
      }
    ],
    historico: [
      { data: '2024-03-10', autor: 'Brasol Team', acao: 'Cadastro Concluído', detalhe: 'Inserção de dados no portal SEMA-MA.' }
    ],
    documentos: [
      { nome: 'Protocolo_CUOS_Patos.pdf', tipo: 'CUOS', status: 'Em Análise' },
      { nome: 'Estudo_Preliminar_Patos.pdf', tipo: 'Estudo Ambiental', status: 'Em Análise' }
    ],
    documentosList: [
      {
        id: 'doc-004',
        projectId: 'bess-002',
        projectName: 'São João dos Patos - MA',
        nome: 'Requerimento e Protocolo de CUOS na Prefeitura de São João dos Patos',
        tipo: 'CUOS',
        status: 'Em Análise',
        dataEmissao: '2024-03-15',
        numeroProtocolo: 'PROT-CUOS-2024-998',
        observacoes: 'Aguardando validação técnica pelo setor de urbanismo municipal.',
        nomeArquivoOriginal: 'Protocolo_CUOS_Patos.pdf',
        cadastradoPor: 'EcoBrasil Consultoria'
      },
      {
        id: 'doc-005',
        projectId: 'bess-002',
        projectName: 'São João dos Patos - MA',
        nome: 'Polígono KMZ da Gleba Agrícola BESS (12.5 ha)',
        tipo: 'KMZ / Geoespacial',
        status: 'Emitido / Válido',
        dataEmissao: '2024-02-10',
        nomeArquivoOriginal: '13_Sao.Joao.Patos.kmz',
        cadastradoPor: 'Maurivan Vaz Ribeiro (Brasol)'
      }
    ]
  },
  {
    id: 'bess-003',
    nome: 'Eldorado do Sul 1 - RS',
    municipio: 'Eldorado do Sul',
    uf: 'RS',
    cuosStatus: 'Emitida',
    cuosDetalhes: 'CUOS deferida pelo município de Eldorado do Sul para implantação de planta fotovoltaica/BESS na Matrícula 3350.',
    orgaoLicenciador: 'FEPAM-RS',
    consultaOrgao: 'Sim',
    cadastros: 'Realizado',
    reuniaoOrgao: 'Sim',
    situacaoLicenciamento: 'Requerimento aberto, boleto de formação emitido - Cancelado por opção da Brasol.',
    statusCategoria: 'Cancelado por Opção da Brasol',
    nivelRisco: 'Alto',
    etapaAtual: 'Processo Descontinuado pela Brasol',
    progressoPct: 20,
    potenciaMWp: 40,
    areaHectares: 15.0,
    areaM2: 150000,
    kmzFileName: '10_Eldorado.Sul_Matricula3350.kmz',
    centerCoordinates: [-30.0847, -51.3328],
    polygonCoordinates: [
      [-30.0810, -51.3360],
      [-30.0815, -51.3290],
      [-30.0880, -51.3300],
      [-30.0875, -51.3370]
    ],
    investimentoEstimadoMilhoes: 55.0,
    dataInicio: '2024-01-20',
    dataPrevisaoConclusao: '2024-08-30',
    etapas: [
      { id: 'e1', nome: 'Consulta Prévia FEPAM', status: 'concluido', dataPrevista: '2024-02-15', dataConclusao: '2024-02-10' },
      { id: 'e2', nome: 'Emissão da CUOS Municipal', status: 'concluido', dataPrevista: '2024-03-30', dataConclusao: '2024-03-22' },
      { id: 'e3', nome: 'Abertura de Requerimento FEPAM', status: 'cancelado', dataPrevista: '2024-04-15', observacao: 'Cancelado por opção estratégica da Brasol.' }
    ],
    tratativas: [
      {
        id: 't-103',
        data: '2026-08-05',
        horario: '11:00',
        orgao: 'FEPAM-RS',
        atendente: 'Atendimento FEPAM',
        tipo: 'E-mail Oficial',
        resumo: 'Envio de notificação oficial informando o cancelamento da solicitação de licenciamento por decisão estratégica da Brasol.',
        statusTratativa: 'Concluído',
        observacoes: 'Processo encerrado administrativamente.',
        cadastradoPor: 'Brasol Regulatory'
      }
    ],
    historico: [
      { data: '2024-05-15', autor: 'Brasol Direction', acao: 'Cancelamento Registrado', detalhe: 'Cancelado por opção estratégica da Brasol.' }
    ],
    documentos: [
      { nome: 'CUOS_Eldorado_3350.pdf', tipo: 'CUOS', status: 'Aprovado' }
    ],
    documentosList: [
      {
        id: 'doc-006',
        projectId: 'bess-003',
        projectName: 'Eldorado do Sul 1 - RS',
        nome: 'Certidão de Uso do Solo Matrícula nº 3350',
        tipo: 'CUOS',
        status: 'Emitido / Válido',
        dataEmissao: '2024-03-22',
        numeroProtocolo: 'CUOS-ELD-3350',
        observacoes: 'Certidão municipal favorável. Projeto posteriormente descontinuado por decisão da Brasol.',
        nomeArquivoOriginal: 'CUOS_Eldorado_3350.pdf',
        cadastradoPor: 'Maurivan Vaz Ribeiro (Brasol)'
      },
      {
        id: 'doc-007',
        projectId: 'bess-003',
        projectName: 'Eldorado do Sul 1 - RS',
        nome: 'Ofício de Solicitação de Cancelamento do Processo FEPAM',
        tipo: 'Certidão / Licença',
        status: 'Emitido / Válido',
        dataEmissao: '2024-05-15',
        numeroProtocolo: 'OF-BRASOL-2024-08',
        observacoes: 'Notificação formal enviada à FEPAM comunicando a desistência do projeto.',
        nomeArquivoOriginal: 'Oficio_Cancelamento_Brasol_FEPAM.pdf',
        cadastradoPor: 'Maurivan Vaz Ribeiro (Brasol)'
      }
    ]
  },
  {
    id: 'bess-004',
    nome: 'Eldorado do Sul 2 - RS',
    municipio: 'Eldorado do Sul',
    uf: 'RS',
    cuosStatus: 'Emitida',
    cuosDetalhes: 'CUOS emitida para a Matrícula 9233 em Eldorado do Sul.',
    orgaoLicenciador: 'FEPAM-RS',
    consultaOrgao: 'Sim',
    cadastros: 'Realizado',
    reuniaoOrgao: 'Sim',
    situacaoLicenciamento: 'Requerimento aberto, boleto de formação emitido - Cancelado por opção da Brasol.',
    statusCategoria: 'Cancelado por Opção da Brasol',
    nivelRisco: 'Alto',
    etapaAtual: 'Processo Descontinuado pela Brasol',
    progressoPct: 20,
    potenciaMWp: 35,
    areaHectares: 11.8,
    areaM2: 118000,
    kmzFileName: '10_Eldorado.Sul_Matricula9233.kmz',
    centerCoordinates: [-30.0900, -51.3400],
    polygonCoordinates: [
      [-30.0870, -51.3430],
      [-30.0875, -51.3370],
      [-30.0930, -51.3380],
      [-30.0925, -51.3440]
    ],
    investimentoEstimatedMilhoes: 50.0,
    dataInicio: '2024-01-20',
    dataPrevisaoConclusao: '2024-08-30',
    etapas: [
      { id: 'e1', nome: 'Consulta Prévia FEPAM', status: 'concluido', dataPrevista: '2024-02-15', dataConclusao: '2024-02-10' },
      { id: 'e2', nome: 'Emissão da CUOS Municipal', status: 'concluido', dataPrevista: '2024-03-30', dataConclusao: '2024-03-22' },
      { id: 'e3', nome: 'Requerimento FEPAM', status: 'cancelado', dataPrevista: '2024-04-15', observacao: 'Cancelado por opção da Brasol.' }
    ],
    tratativas: [],
    historico: [
      { data: '2024-05-15', autor: 'Brasol Direction', acao: 'Cancelamento Registrado', detalhe: 'Cancelado por opção estratégica da Brasol.' }
    ],
    documentos: [
      { nome: 'CUOS_Eldorado_9233.pdf', tipo: 'CUOS', status: 'Aprovado' }
    ],
    documentosList: [
      {
        id: 'doc-008',
        projectId: 'bess-004',
        projectName: 'Eldorado do Sul 2 - RS',
        nome: 'Certidão de Uso do Solo Matrícula nº 9233',
        tipo: 'CUOS',
        status: 'Emitido / Válido',
        dataEmissao: '2024-03-22',
        numeroProtocolo: 'CUOS-ELD-9233',
        observacoes: 'Certidão municipal deferida.',
        nomeArquivoOriginal: 'CUOS_Eldorado_9233.pdf',
        cadastradoPor: 'Maurivan Vaz Ribeiro (Brasol)'
      }
    ]
  },
  {
    id: 'bess-005',
    nome: 'Quixeré - CE',
    municipio: 'Quixeré',
    uf: 'CE',
    cuosStatus: 'Emitida',
    cuosDetalhes: 'CUOS deferida pela Prefeitura de Quixeré/CE com alinhamento ambiental para enquadramento simplificado SEMACE.',
    orgaoLicenciador: 'SEMACE-CE',
    consultaOrgao: 'Sim',
    cadastros: 'Realizado',
    reuniaoOrgao: 'Sim',
    situacaoLicenciamento: 'Enquadramento aprovado. Aguardando envio de complementações geotécnicas do BESS.',
    statusCategoria: 'Em Análise',
    nivelRisco: 'Baixo',
    etapaAtual: 'Complementação de Estudos SEMACE',
    progressoPct: 75,
    potenciaMWp: 50,
    areaHectares: 10.4,
    areaM2: 104000,
    kmzFileName: '10_Planta.Georreferenciada_Shapefile.KMZ.kmz',
    centerCoordinates: [-5.0742, -37.9886],
    polygonCoordinates: [
      [-5.0710, -37.9910],
      [-5.0715, -37.9850],
      [-5.0770, -37.9860],
      [-5.0765, -37.9920]
    ],
    investimentoEstimadoMilhoes: 70.0,
    dataInicio: '2024-01-10',
    dataPrevisaoConclusao: '2024-07-30',
    etapas: [
      { id: 'e1', nome: 'Protocolo de CUOS Quixeré', status: 'concluido', dataPrevista: '2024-02-15', dataConclusao: '2024-02-05' },
      { id: 'e2', nome: 'Triagem SEMACE-CE', status: 'concluido', dataPrevista: '2024-03-20', dataConclusao: '2024-03-12' },
      { id: 'e3', nome: 'Elaboração do RAS/RCA', status: 'concluido', dataPrevista: '2024-05-10', dataConclusao: '2024-05-02' },
      { id: 'e4', nome: 'Análise de Complementações', status: 'em_andamento', dataPrevista: '2024-06-30' },
      { id: 'e5', nome: 'Emissão da Licença Simplificada (LS)', status: 'pendente', dataPrevista: '2024-07-30' }
    ],
    tratativas: [],
    historico: [],
    documentos: [
      { nome: 'CUOS_Quixere_CE.pdf', tipo: 'CUOS', status: 'Aprovado' },
      { nome: 'RAS_Quixere_BESS.pdf', tipo: 'Estudo Ambiental', status: 'Em Análise' }
    ],
    documentosList: [
      {
        id: 'doc-009',
        projectId: 'bess-005',
        projectName: 'Quixeré - CE',
        nome: 'Certidão de Conformidade de Uso do Solo - Quixeré/CE',
        tipo: 'CUOS',
        status: 'Emitido / Válido',
        dataEmissao: '2024-02-05',
        numeroProtocolo: 'CUOS-QUIX-2024-11',
        observacoes: 'Certidão em conformidade com o plano diretor do município.',
        nomeArquivoOriginal: 'CUOS_Quixere_CE.pdf',
        cadastradoPor: 'EcoBrasil Consultoria'
      },
      {
        id: 'doc-010',
        projectId: 'bess-005',
        projectName: 'Quixeré - CE',
        nome: 'Relatório Ambiental Simplificado - RAS BESS Quixeré',
        tipo: 'Estudo Ambiental',
        status: 'Em Análise',
        dataEmissao: '2024-05-02',
        numeroProtocolo: 'RAS-SEMACE-2024-88',
        observacoes: 'Estudo protocolado no sistema Natuur/SEMACE.',
        nomeArquivoOriginal: 'RAS_Quixere_BESS.pdf',
        cadastradoPor: 'EcoBrasil Consultoria'
      }
    ]
  },
  {
    id: 'bess-006',
    nome: 'Piripiri - PI',
    municipio: 'Piripiri',
    uf: 'PI',
    cuosStatus: 'Emitida',
    cuosDetalhes: 'CUOS deferida para área de 5 hectares em Piripiri/PI.',
    orgaoLicenciador: 'SEMARH-PI',
    consultaOrgao: 'Sim',
    cadastros: 'Realizado',
    reuniaoOrgao: 'Sim',
    situacaoLicenciamento: 'Processo de licenciamento ambiental simplificado em fase final de emissão do parecer.',
    statusCategoria: 'Em Análise',
    nivelRisco: 'Baixo',
    etapaAtual: 'Emissão de Parecer Técnico SEMARH',
    progressoPct: 80,
    potenciaMWp: 20,
    areaHectares: 5.0,
    areaM2: 50000,
    kmzFileName: 'Piripiri 5ha.kmz',
    centerCoordinates: [-4.2731, -41.7769],
    polygonCoordinates: [
      [-4.2710, -41.7790],
      [-4.2715, -41.7750],
      [-4.2750, -41.7755],
      [-4.2745, -41.7795]
    ],
    investimentoEstimadoMilhoes: 30.0,
    dataInicio: '2024-02-15',
    dataPrevisaoConclusao: '2024-07-15',
    etapas: [
      { id: 'e1', nome: 'Protocolo CUOS Piripiri', status: 'concluido', dataPrevista: '2024-03-10', dataConclusao: '2024-03-01' },
      { id: 'e2', nome: 'Cadastro no iLicenciamento SEMARH', status: 'concluido', dataPrevista: '2024-03-30', dataConclusao: '2024-03-20' },
      { id: 'e3', nome: 'Vistoria Técnico-Ambiental', status: 'concluido', dataPrevista: '2024-05-15', dataConclusao: '2024-05-10' },
      { id: 'e4', nome: 'Parecer Técnico Final', status: 'em_andamento', dataPrevista: '2024-06-30' },
      { id: 'e5', nome: 'Emissão da Licença Prévia e de Instalação (LPI)', status: 'pendente', dataPrevista: '2024-07-15' }
    ],
    tratativas: [],
    historico: [],
    documentos: [
      { nome: 'CUOS_Piripiri.pdf', tipo: 'CUOS', status: 'Aprovado' },
      { nome: 'Piripiri 5ha.kmz', tipo: 'KMZ / Geoespacial', status: 'Aprovado' }
    ],
    documentosList: [
      {
        id: 'doc-011',
        projectId: 'bess-006',
        projectName: 'Piripiri - PI',
        nome: 'Certidão de Uso do Solo - Piripiri/PI (5 ha)',
        tipo: 'CUOS',
        status: 'Emitido / Válido',
        dataEmissao: '2024-03-01',
        numeroProtocolo: 'CUOS-PIR-2024-03',
        observacoes: 'Certidão emitida para a área de 5.0 hectares.',
        nomeArquivoOriginal: 'CUOS_Piripiri.pdf',
        cadastradoPor: 'Maurivan Vaz Ribeiro (Brasol)'
      }
    ]
  },
  {
    id: 'bess-007',
    nome: 'Eliseu Martins - PI',
    municipio: 'Eliseu Martins',
    uf: 'PI',
    cuosStatus: 'Emitida',
    cuosDetalhes: 'CUOS liberada para área de 7.9 hectares em Eliseu Martins/PI.',
    orgaoLicenciador: 'SEMARH-PI',
    consultaOrgao: 'Sim',
    cadastros: 'Realizado',
    reuniaoOrgao: 'Sim',
    situacaoLicenciamento: 'Estudos ambientais complementares protocolados na SEMARH-PI.',
    statusCategoria: 'Aguardando Estudos',
    nivelRisco: 'Médio',
    etapaAtual: 'Análise de Estudo de Fauna e Flora',
    progressoPct: 60,
    potenciaMWp: 35,
    areaHectares: 7.9,
    areaM2: 79000,
    kmzFileName: 'Eliseu Martins - 7,9ha.kmz',
    centerCoordinates: [-8.0925, -43.6622],
    polygonCoordinates: [
      [-8.0900, -43.6650],
      [-8.0905, -43.6600],
      [-8.0950, -43.6610],
      [-8.0945, -43.6660]
    ],
    investimentoEstimadoMilhoes: 50.0,
    dataInicio: '2024-02-10',
    dataPrevisaoConclusao: '2024-08-15',
    etapas: [
      { id: 'e1', nome: 'Requerimento da CUOS', status: 'concluido', dataPrevista: '2024-03-05', dataConclusao: '2024-02-28' },
      { id: 'e2', nome: 'Abertura do Processo na SEMARH', status: 'concluido', dataPrevista: '2024-03-25', dataConclusao: '2024-03-18' },
      { id: 'e3', nome: 'Elaboração de Inventário Florestal', status: 'em_andamento', dataPrevista: '2024-06-15' },
      { id: 'e4', nome: 'Emissão da Licença Ambiental', status: 'pendente', dataPrevista: '2024-08-15' }
    ],
    tratativas: [],
    historico: [],
    documentos: [
      { nome: 'CUOS_Eliseu_Martins.pdf', tipo: 'CUOS', status: 'Aprovado' }
    ],
    documentosList: [
      {
        id: 'doc-012',
        projectId: 'bess-007',
        projectName: 'Eliseu Martins - PI',
        nome: 'Certidão de Uso do Solo - Eliseu Martins/PI (7.9 ha)',
        tipo: 'CUOS',
        status: 'Emitido / Válido',
        dataEmissao: '2024-02-28',
        numeroProtocolo: 'CUOS-EM-2024-09',
        observacoes: 'Validação municipal concluída.',
        nomeArquivoOriginal: 'CUOS_Eliseu_Martins.pdf',
        cadastradoPor: 'EcoBrasil Consultoria'
      }
    ]
  },
  {
    id: 'bess-008',
    nome: 'Jaíba - MG',
    municipio: 'Jaíba',
    uf: 'MG',
    cuosStatus: 'Emitida',
    cuosDetalhes: 'CUOS homologada pela Prefeitura de Jaíba/MG para área de locação de 9.5 ha.',
    orgaoLicenciador: 'SEMAD-MG',
    consultaOrgao: 'Sim',
    cadastros: 'Realizado',
    reuniaoOrgao: 'Sim',
    situacaoLicenciamento: 'FCEU enviado via Sistema SLA/SEMAD. Aguardando emissão do certificado de LAS-Cadastro.',
    statusCategoria: 'Em Análise',
    nivelRisco: 'Baixo',
    etapaAtual: 'Certificado LAS-Cadastro SEMAD',
    progressoPct: 85,
    potenciaMWp: 50,
    areaHectares: 9.5,
    areaM2: 95000,
    kmzFileName: 'Area Locação - Jaiba.kml',
    centerCoordinates: [-15.1417, -43.6828],
    polygonCoordinates: [
      [-15.1390, -43.6860],
      [-15.1395, -43.6800],
      [-15.1440, -43.6810],
      [-15.1435, -43.6870]
    ],
    investimentoEstimadoMilhoes: 70.0,
    dataInicio: '2024-01-05',
    dataPrevisaoConclusao: '2024-06-30',
    etapas: [
      { id: 'e1', nome: 'Obtenção da CUOS Jaíba', status: 'concluido', dataPrevista: '2024-01-30', dataConclusao: '2024-01-22' },
      { id: 'e2', nome: 'Cadastro no SLA/SEMAD-MG', status: 'concluido', dataPrevista: '2024-02-20', dataConclusao: '2024-02-15' },
      { id: 'e3', nome: 'Preenchimento FCEU BESS', status: 'concluido', dataPrevista: '2024-04-10', dataConclusao: '2024-04-05' },
      { id: 'e4', nome: 'Emissão da LAS-Cadastro', status: 'em_andamento', dataPrevista: '2024-06-30' }
    ],
    tratativas: [],
    historico: [],
    documentos: [
      { nome: 'CUOS_Jaiba_MG.pdf', tipo: 'CUOS', status: 'Aprovado' },
      { nome: 'FCEU_SEMAD_Jaiba.pdf', tipo: 'Parecer Técnico', status: 'Em Análise' }
    ],
    documentosList: [
      {
        id: 'doc-013',
        projectId: 'bess-008',
        projectName: 'Jaíba - MG',
        nome: 'Certidão de Uso e Ocupação do Solo - Jaíba/MG (9.5 ha)',
        tipo: 'CUOS',
        status: 'Emitido / Válido',
        dataEmissao: '2024-01-22',
        numeroProtocolo: 'CUOS-JAIBA-2024-01',
        observacoes: 'Certidão de conformidade urbanística aprovada.',
        nomeArquivoOriginal: 'CUOS_Jaiba_MG.pdf',
        cadastradoPor: 'Maurivan Vaz Ribeiro (Brasol)'
      },
      {
        id: 'doc-014',
        projectId: 'bess-008',
        projectName: 'Jaíba - MG',
        nome: 'Formulário FCEU e Anexo Georreferenciado SLA-SEMAD',
        tipo: 'Parecer Técnico',
        status: 'Em Análise',
        dataEmissao: '2024-04-05',
        numeroProtocolo: 'SLA-MG-2024-7712',
        observacoes: 'Protocolado no sistema SLA da Secretaria Estadual de Meio Ambiente de MG.',
        nomeArquivoOriginal: 'FCEU_SEMAD_Jaiba.pdf',
        cadastradoPor: 'EcoBrasil Consultoria'
      }
    ]
  }
];
