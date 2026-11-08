/* Conteúdo da página: valores, programação e texto do termo.
   Para mudar textos, horários ou nomes, edite apenas este arquivo. */
window.MESA = {

  /* ---------- CONFIGURAÇÃO ----------
     ENDPOINT: cole aqui a URL do Apps Script (veja o README) quando a conta Google estiver definida.
     Enquanto estiver vazio, o formulário funciona em modo de demonstração e não envia nada. */
  CONFIG: {
    ENDPOINT: "https://script.google.com/macros/s/AKfycbyp223Fpt0C8o6ZwuPdmftmlG4W6BgKy4RAZzfJzYYp-Wd4FNVHCAl13zuyx9v2vNrr/exec",
    LOCAL_EVENTO: "Igreja da Cidade, Rua Todas as Nações, s/n, Vila Tatetuba, São José dos Campos, SP",
    INICIO_EVENTO: "2026-11-09T12:30:00-03:00",
    FIM_EVENTO: "2026-11-11T12:30:00-03:00"
  },

  /* Categorias e valor de contribuição mensal (o servidor confere os mesmos valores) */
  categorias: [
    ["Organização Cooperadora", "R$ 300,00"],
    ["Organização Parceira", "R$ 700,00"],
    ["Organização Mantenedora", "R$ 1.600,00"]
  ],

  valores: [
    ["Cristo no centro de tudo", "Jesus Cristo é o fundamento, a razão e o propósito supremo da existência da Mesa."],
    ["A Palavra de Deus como autoridade", "As Escrituras Sagradas norteiam soberanamente a nossa fé, a prática institucional e as decisões."],
    ["A Grande Comissão como causa comum", "Alinhamento integral para que mais pessoas conheçam, sigam e se tornem discípulos de Jesus."],
    ["A unidade da Igreja", "Honra à diversidade da Igreja de Cristo e cooperação mútua acima de diferenças teológicas secundárias."],
    ["Oração como fundamento da missão", "Busca prioritária pela direção de Deus em oração antes de qualquer desenho estratégico."],
    ["Evangelização como estilo de vida", "Inspiração ativa para que cada cristão viva e compartilhe o Evangelho diariamente."],
    ["Discipulado como continuidade da missão", "Compromisso de ajudar as pessoas a amadurecerem em Cristo por meio da igreja local."],
    ["Humildade e serviço", "Cooperação mútua com espírito de serviço, rejeitando a competição institucional."],
    ["Integridade e transparência", "Responsabilidade, ética cristã e rigorosa prestação de contas."],
    ["Visão de Reino", "Os interesses do Reino de Deus colocados estritamente acima das agendas particulares de cada organização."]
  ],

  /* Vozes. Para usar foto, coloque o arquivo em assets/palestrantes/ e escreva o nome dele em "foto".
     Sem "foto", aparecem as iniciais em círculo. */
  palestrantes: [
    { nome: "Pr Young Cho", papel: "Ministração, segunda 9/11. Diretor global do BSH.", foto: "" },
    { nome: "Ana Paula", papel: "Ministração: a importância do cuidado pastoral, segunda 9/11.", foto: "" },
    { nome: "Pr Carlito Paes", papel: "Devocional, terça 10/11 pela manhã.", foto: "" },
    { nome: "Pr Acyr Junior", papel: "Devocional, terça 10/11 à tarde.", foto: "" },
    { nome: "Nando Valente", papel: "Apresentação estatística, terça 10/11.", foto: "" }
  ],

  /* Programação. kind: "session" (título de sessão), "break" (pausa) ou "item".
     sub: partes do bloco. Horários no fuso de Brasília. */
  dias: [
    {
      id: "seg", nome: "Segunda", data: "09/11", iso: "2026-11-09",
      resumo: { num: "09", dia: "segunda", titulo: "Abertura e oficialização da Mesa", destaques: ["Apresentação das organizações", "Ministrações com Pr Young Cho e Ana Paula", "Apresentação e oficialização da Mesa"], quem: ["Pr Young Cho", "Ana Paula"] },
      blocos: [
        { kind: "item", ini: "12:30", fim: "13:00", titulo: "Recepção" },
        { kind: "session", titulo: "1ª Sessão" },
        { kind: "item", ini: "13:00", fim: "13:05", titulo: "Palavra de boas-vindas" },
        { kind: "item", ini: "13:05", fim: "13:50", titulo: "Louvor, oração e devocional",
          sub: ["Louvor 10 min", "Oração 5 min", "Devocional 25 min", "Oração de gratidão 5 min"] },
        { kind: "item", ini: "13:50", fim: "15:25", titulo: "Apresentação das organizações" },
        { kind: "break", ini: "15:30", fim: "15:50", titulo: "Coffee break" },
        { kind: "session", titulo: "2ª Sessão" },
        { kind: "item", ini: "15:50", fim: "16:15", titulo: "Ministração", sub: ["Pr Young Cho, diretor global do BSH"] },
        { kind: "item", ini: "16:15", fim: "16:40", titulo: "Ministração: a importância do cuidado pastoral", sub: ["Com Ana Paula"] },
        { kind: "item", ini: "16:40", fim: "17:35", titulo: "Apresentação da proposta da Mesa",
          sub: ["Apresentação 20 min", "Tempo para discussão 25 min", "Oficialização da Mesa 15 min"] }
      ]
    },
    {
      id: "ter", nome: "Terça", data: "10/11", iso: "2026-11-10",
      resumo: { num: "10", dia: "terça", titulo: "Agenda Geral e Agenda Comum", destaques: ["Ministério Nepal e Friday Outreach", "Oficialização da Agenda Geral", "Escolha das 2 cidades"], quem: ["Pr Carlito Paes", "Pr Acyr Junior", "Nando Valente"] },
      blocos: [
        { kind: "session", titulo: "3ª Sessão" },
        { kind: "item", ini: "09:00", fim: "09:45", titulo: "Louvor, oração e devocional",
          sub: ["Louvor 10 min", "Oração 5 min", "Devocional com Pr Carlito Paes, 25 min", "Oração de gratidão 5 min"] },
        { kind: "item", ini: "09:45", fim: "10:10", titulo: "Ministério Nepal: como mobilizar e alcançar um país" },
        { kind: "item", ini: "10:10", fim: "10:25", titulo: "Friday Outreach" },
        { kind: "item", ini: "10:25", fim: "11:00", titulo: "Convidados" },
        { kind: "break", ini: "11:00", fim: "11:20", titulo: "Coffee break" },
        { kind: "session", titulo: "4ª Sessão" },
        { kind: "item", ini: "11:20", fim: "12:00", titulo: "1ª proposta: apresentação da Agenda Geral" },
        { kind: "item", ini: "12:00", fim: "12:20", titulo: "Ajustes e oficialização da Agenda Geral" },
        { kind: "break", ini: "12:30", fim: "14:00", titulo: "Almoço" },
        { kind: "session", titulo: "5ª Sessão" },
        { kind: "item", ini: "14:00", fim: "14:45", titulo: "Louvor, oração e devocional",
          sub: ["Louvor 10 min", "Oração 5 min", "Devocional com Pr Acyr Junior, 25 min", "Oração de gratidão 5 min"] },
        { kind: "item", ini: "14:45", fim: "16:10", titulo: "2ª proposta" },
        { kind: "item", ini: "16:10", fim: "16:20", titulo: "Apresentação da Agenda Comum" },
        { kind: "break", ini: "16:30", fim: "16:50", titulo: "Coffee break" },
        { kind: "session", titulo: "6ª Sessão" },
        { kind: "item", ini: "16:50", fim: "17:05", titulo: "Mesas de discussão da Agenda Comum" },
        { kind: "item", ini: "17:05", fim: "17:35", titulo: "Apresentação estatística", sub: ["Com Nando Valente"] },
        { kind: "item", ini: "17:35", fim: "17:50", titulo: "Escolha das 2 cidades" }
      ]
    },
    {
      id: "qua", nome: "Quarta", data: "11/11", iso: "2026-11-11",
      resumo: { num: "11", dia: "quarta", titulo: "Mesa 2027 e oração pelo Brasil", destaques: ["Relatórios de oficialização e da proposta", "Mesa 2027, em outubro, no Centro-Oeste", "Oração pelo Brasil"], quem: [] },
      blocos: [
        { kind: "session", titulo: "7ª Sessão" },
        { kind: "item", ini: "09:00", fim: "09:45", titulo: "Louvor, oração e devocional",
          sub: ["Louvor 10 min", "Oração 5 min", "Devocional 25 min", "Oração de gratidão 5 min"] },
        { kind: "item", ini: "09:45", fim: "11:00", titulo: "Convidados" },
        { kind: "break", ini: "11:00", fim: "11:20", titulo: "Coffee break" },
        { kind: "session", titulo: "8ª Sessão" },
        { kind: "item", ini: "11:20", fim: "11:35", titulo: "Relatório de oficialização" },
        { kind: "item", ini: "11:35", fim: "11:45", titulo: "Relatório da proposta" },
        { kind: "item", ini: "11:45", fim: "12:00", titulo: "Mesa 2027, outubro, Centro-Oeste", sub: ["Indicação de cidade"] },
        { kind: "item", ini: "12:00", fim: "12:10", titulo: "Oração pelo Brasil" },
        { kind: "item", ini: "12:10", fim: "12:20", titulo: "Palavra de gratidão" }
      ]
    }
  ],

  /* Texto do termo. t: title | sub | h | p | li (lead = trecho em negrito no início) */
  termo: [
    { t: "title", x: "TERMO DE ACORDO DE COOPERAÇÃO E PARCERIA INSTITUCIONAL" },
    { t: "sub", x: "MESA REDONDA BRASILEIRA DE EVANGELIZAÇÃO" },

    { t: "h", x: "PREÂMBULO" },
    { t: "p", x: "Artigo 1º. Por este instrumento, as Organizações Missionárias e Eclesiásticas que ao final assinam, manifestam o seu livre consentimento e compromisso em integrar a Mesa Redonda Brasileira de Evangelização (doravante denominada simplesmente \"Mesa Redonda Brasileira\")." },
    { t: "p", x: "Parágrafo único. Este Termo fundamenta-se na comunhão cristã, na cooperação mútua e no desejo comum de fazer avançar o Reino de Deus no território nacional, não gerando entre as partes qualquer vínculo de natureza trabalhista, societária ou comercial." },

    { t: "h", x: "CLÁUSULA PRIMEIRA: DA MISSÃO E DO PROPÓSITO" },
    { t: "p", x: "1.1. A Mesa Redonda Brasileira de Evangelização é um movimento nacional que visa levar o Evangelho a todos os cantos do Brasil por meio da unidade prática e da cooperação estratégica de várias organizações missionárias." },
    { t: "p", x: "1.2. O movimento compromete-se a deixar de ser um ecossistema focado apenas em eventos esporádicos para consolidar-se como uma estrutura permanente de relacionamento, comunhão, oração, planejamento e serviço contínuo à Igreja brasileira." },

    { t: "h", x: "CLÁUSULA SEGUNDA: DOS VALORES E PRINCÍPIOS NORTEADORES" },
    { t: "p", x: "A atuação da Mesa Redonda Brasileira e de todas as suas organizações parceiras será rigidamente balizada pelos seguintes princípios de fé e prática:" },
    { t: "li", lead: "Cristo no centro de tudo:", x: "Jesus Cristo é o fundamento, a razão e o propósito supremo da existência da Mesa." },
    { t: "li", lead: "A Palavra de Deus como autoridade:", x: "As Escrituras Sagradas norteiam soberanamente a nossa fé, prática institucional e decisões." },
    { t: "li", lead: "A Grande Comissão como causa comum:", x: "Alinhamento integral para que mais pessoas conheçam, sigam e se tornem discípulos de Jesus." },
    { t: "li", lead: "A unidade da Igreja:", x: "Honra à diversidade da Igreja de Cristo e cooperação mútua acima de diferenças teológicas secundárias." },
    { t: "li", lead: "Oração como fundamento da missão:", x: "Busca prioritária pela direção de Deus em oração antes de qualquer desenho estratégico." },
    { t: "li", lead: "Evangelização como estilo de vida:", x: "Inspiração ativa para que cada cristão viva e compartilhe o Evangelho diariamente." },
    { t: "li", lead: "Discipulado como continuidade da missão:", x: "Compromisso em ajudar as pessoas a amadurecerem em Cristo por meio da igreja local." },
    { t: "li", lead: "Humildade e serviço:", x: "Cooperação mútua com espírito de serviço, rejeitando a competição institucional." },
    { t: "li", lead: "Integridade e transparência:", x: "Responsabilidade, ética cristã e rigorosa prestação de contas." },
    { t: "li", lead: "Visão de Reino:", x: "Colocação dos interesses do Reino de Deus estritamente acima das agendas particulares de nossas organizações." },

    { t: "h", x: "CLÁUSULA TERCEIRA: DOS DIREITOS DAS ORGANIZAÇÕES PARCEIRAS" },
    { t: "p", x: "Toda organização devidamente integrada ao movimento terá o direito de:" },
    { t: "p", x: "3.1. Participar ativamente de um ambiente seguro de confiança, comunhão e cooperação ministerial." },
    { t: "p", x: "3.2. Ser ouvida com absoluto respeito e em condições de igualdade institucional." },
    { t: "p", x: "3.3. Contribuir diretamente para a construção e o desenho da agenda nacional de evangelização." },
    { t: "p", x: "3.4. Receber relatórios gerenciais, informativos e prestações de contas com total transparência." },
    { t: "p", x: "3.5. Enviar representantes para participar das reuniões, fóruns nacionais/regionais e grupos de trabalho." },
    { t: "p", x: "3.6. Propor novas iniciativas, projetos práticos e temas relevantes para reflexão teológica ou missiológica." },
    { t: "p", x: "3.7. Desenvolver relacionamentos estratégicos e redes de cooperação com outras organizações participantes." },
    { t: "p", x: "3.8. Ter acesso prioritário e usufruir da plataforma digital de relacionamento e colaboração da Mesa." },
    { t: "p", x: "3.9. Identificar-se publicamente como parte integrante deste movimento nacional de unidade e proclamação." },

    { t: "h", x: "CLÁUSULA QUARTA: DOS DEVERES DAS ORGANIZAÇÕES PARCEIRAS" },
    { t: "p", x: "Como contrapartida e demonstração de compromisso com o Pacto de Unidade, as organizações se obrigam a:" },
    { t: "p", x: "4.1. Preservar zelosamente a unidade, a paz e o espírito de cooperação interdenominacional." },
    { t: "p", x: "4.2. Participar com assiduidade das reuniões estabelecidas e contribuir na construção coletiva do movimento." },
    { t: "p", x: "4.3. Interceder e orar regularmente pela evangelização do Brasil, pela Igreja e pelas lideranças da Mesa." },
    { t: "p", x: "4.4. Compartilhar de forma generosa suas experiências, aprendizados, metodologias e boas práticas missivas." },
    { t: "p", x: "4.5. Honrar e zelar pelos 10 (dez) Princípios e Valores estabelecidos na Cláusula Segunda deste termo." },
    { t: "p", x: "4.6. Alimentar um ambiente interno focado no respeito mútuo, na escuta ativa e na mútua confiança." },
    { t: "p", x: "4.7. Garantir presença, sempre que viável, nos encontros nacionais e regionais promovidos pela Mesa." },
    { t: "p", x: "4.8. Representar sua instituição de origem com ética irrepreensível, humildade e espírito voluntário." },
    { t: "p", x: "4.9. Apoiar a sustentabilidade financeira do movimento e atuar para que a cooperação gere frutos práticos de oração, evangelização e discipulado no Brasil." },

    { t: "h", x: "CLÁUSULA QUINTA: DA GESTÃO, OPERAÇÃO E AGENDA COLETIVA" },
    { t: "p", x: "5.1. Para viabilizar a continuidade e a gestão diária das ações da Mesa, fica estabelecida a criação de um Grupo Executivo, responsável por gerir e monitorar o plano de trabalho do movimento." },
    { t: "p", x: "5.2. A operação diária será conduzida por um Pastor Executivo, contratado para dedicar tempo integral à coordenação geral da Mesa, ao relacionamento pastoral com os participantes, à facilitação das reuniões, ao acompanhamento dos grupos de trabalho e ao cumprimento das decisões coletivas." },
    { t: "p", x: "5.3. O plano de relacionamento e engajamento das organizações parceiras seguirá um cronograma contínuo composto por:" },
    { t: "li", x: "Reuniões mensais em ambiente virtual (on-line);" },
    { t: "li", x: "Encontros regionais periódicos;" },
    { t: "li", x: "Um Encontro Nacional Anual." },
    { t: "p", x: "5.4. As instituições signatárias comprometem-se a nutrir uma agenda coletiva e compartilhada, visando promover ações e eventos conjuntos em que caiba a mútua colaboração de infraestrutura, pessoal ou divulgação." },

    { t: "h", x: "CLÁUSULA SEXTA: DA SUSTENTABILIDADE FINANCEIRA COMPARTILHADA" },
    { t: "p", x: "6.1. As partes reconhecem que a manutenção de uma estrutura mínima de apoio (plataforma digital, contratação do Pastor Executivo e suporte administrativo/comunicação) é indispensável para o cumprimento dos objetivos da Mesa." },
    { t: "p", x: "6.2. A sustentabilidade do movimento será mantida sob o regime de responsabilidade compartilhada, por meio de um modelo de contribuição a ser definido e ajustado coletivamente pelas organizações." },
    { t: "p", x: "6.3. O modelo de contribuição financeira respeitará estritamente a realidade orçamentária, o porte institucional e a capacidade financeira individual de cada organização parceira, vedando-se qualquer prática de exclusão por incapacidade contributiva temporária ou permanente." },
    { t: "p", x: "Valor de contribuição mensal:" },
    { t: "li", lead: "Organização Cooperadora", x: "R$ 300,00" },
    { t: "li", lead: "Organização Parceira", x: "R$ 700,00" },
    { t: "li", lead: "Organização Mantenedora", x: "R$ 1.600,00" },

    { t: "h", x: "CLÁUSULA SÉTIMA: DO DESLIGAMENTO E CONSIDERAÇÕES FINAIS" },
    { t: "p", x: "7.1. O presente acordo é celebrado por prazo indeterminado." },
    { t: "p", x: "7.2. Qualquer organização participante poderá solicitar o seu desligamento voluntário da Mesa Redonda Brasileira a qualquer tempo, mediante comunicação simples por escrito direcionada ao Grupo Executivo, sem qualquer ônus ou penalidade." },
    { t: "p", x: "7.3. O descumprimento reiterado dos Princípios e Valores ou dos Deveres previstos neste instrumento sujeitará a organização parceira à avaliação de sua permanência na Mesa pelo Grupo Executivo, visando sempre a restauração, a proteção e a preservação da unidade do movimento." },
    { t: "p", x: "E, por estarem plenamente de acordo com os termos estabelecidos neste Acordo de Cooperação, assinam o presente instrumento por meio de seus representantes legais." }
  ]
};
