/* Elaborado por Oscar Franco
 * STV Play — protótipo académico para trabalho de campo da cadeira de Tecnologias Web (2026).
 * JavaScript sem frameworks, com CRUD local, pesquisa, filtros e ordenação.
 * Este projecto não altera o catálogo oficial e não fornece streaming.
 *
 * Algoritmos:
 * - Pesquisa e filtragem: varrimento linear O(n) por consulta; comparação de texto
 *   utiliza normalização Unicode para ignorar acentos e diferenças de maiúsculas.
 * - Ordenação: Array.prototype.sort, geralmente O(n log n) para comparação;
 *   a especificação não impõe um algoritmo interno universal entre motores JS.
 * - Favoritos: Set, com consulta média O(1).
 */
'use strict';

// Dados obtidos de categorias e programas públicos em stvplay.co.mz (Outubro de 2026).
// Algumas datas de referência dos programas (não de episódios específicos) são
// ILUSTRATIVAS para permitir a demonstração de ordenação;

//Lista de catologos dos varios programas. selecionamos 30 ao total
const INITIAL_CATALOG = Object.freeze([
  {id:'stv-001',title:'Fama Show',category:'Entretenimento',date:'2026-07-19',duration:245,description:'Concurso de talentos musicais de Moçambique, com galas e apresentações de artistas nacionais.',url:'https://www.stvplay.co.mz/fama-show',theme:'rose',symbol:'✳',poster:'FAMA SHOW',origin:'original',illustrativeDate:false},
  {id:'stv-002',title:'Jornal da Noite',category:'Informação',date:'2026-10-11',duration:62,description:'Noticiário diário com destaque para os principais acontecimentos de Moçambique e do mundo.',url:'https://www.stvplay.co.mz/jornal-da-noite',theme:'blue',symbol:'◈',poster:'JORNAL DA NOITE',image:'assets/posters/jornal-da-noite.jpg',origin:'original',illustrativeDate:false},
  {id:'stv-003',title:'Pontos de Vista',category:'Informação',date:'2026-10-11',duration:60,description:'Análises de temas da economia, política e sociedade moçambicanas.',url:'https://www.stvplay.co.mz/pontos-de-vista',theme:'violet',symbol:'✺',poster:'PONTOS DE VISTA',image:'assets/posters/pontos-de-vista.jpg',origin:'original',illustrativeDate:false},
  {id:'stv-004',title:'Noite Informativa',category:'Informação',date:'2026-10-12',duration:62,description:'Programa de análise e debate com especialistas sobre assuntos da actualidade.',url:'https://www.stvplay.co.mz/noite-informativa',theme:'cobalt',symbol:'◎',poster:'NOITE INFORMATIVA',image:'assets/posters/noite-informativa.jpg',origin:'original',illustrativeDate:false},
  {id:'stv-005',title:'Festival de Vozes',category:'Entretenimento',date:'2026-08-09',duration:107,description:'Encontros musicais, vozes, coros e momentos que celebram o talento vocal.',url:'https://www.stvplay.co.mz/festival-de-vozes-1',theme:'orange',symbol:'✦',poster:'FESTIVAL DE VOZES',image:'assets/posters/festival-de-vozes.jpg',origin:'original',illustrativeDate:false},
  {id:'stv-006',title:'Mozkids',category:'Variedades',date:'2026-01-15',duration:45,description:'Programa infantil com actividades educativas, jogos e muita diversão.',url:'https://www.stvplay.co.mz/variedades',theme:'mint',symbol:'✳',poster:'MOZ KIDS',origin:'original',illustrativeDate:true},
  {id:'stv-007',title:'Moztech TV',category:'Variedades',date:'2026-04-12',duration:42,description:'Tecnologia, inovação e tendências em destaque através de conteúdos acessíveis.',url:'https://www.stvplay.co.mz/variedades',theme:'cobalt',symbol:'⌁',poster:'MOZTECH TV',origin:'original',illustrativeDate:true},
  {id:'stv-008',title:'Debate da Nação',category:'Informação',date:'2026-10-04',duration:86,description:'Especialistas debatem temas e desafios relevantes para o futuro de Moçambique.',url:'https://www.stvplay.co.mz/informacao',theme:'blue',symbol:'◉',poster:'DEBATE DA NAÇÃO',image:'assets/posters/debate-da-nacao.jpg',origin:'original',illustrativeDate:false},
  {id:'stv-009',title:'Festival MOSA',category:'Entretenimento',date:'2026-05-08',duration:98,description:'Concertos de música coral com grupos de Moçambique e da África do Sul.',url:'https://www.stvplay.co.mz/videos/video-festival-mosa-retificado',theme:'pink',symbol:'✦',poster:'MOSA',origin:'original',illustrativeDate:true},
  {id:'stv-010',title:'Entre Linhas',category:'Informação',date:'2026-03-19',duration:55,description:'Convidados partilham histórias de vida e percursos profissionais.',url:'https://www.stvplay.co.mz/informacao',theme:'violet',symbol:'⌁',poster:'ENTRE LINHAS',image:'assets/posters/entre-linhas.jpg',origin:'original',illustrativeDate:true},
  {id:'stv-011',title:'Quid Juris',category:'Informação',date:'2026-03-01',duration:60,description:'Discussão e explicação dos principais assuntos jurídicos que afectam a sociedade.',url:'https://www.stvplay.co.mz/informacao',theme:'green',symbol:'◈',poster:'QUID JURIS',image:'assets/posters/quid-juris.jpg',origin:'original',illustrativeDate:true},
  {id:'stv-012',title:'Mozkids Talents',category:'Entretenimento',date:'2026-05-02',duration:119,description:'Reality infantil que destaca talentos na música, dança e representação.',url:'https://www.stvplay.co.mz/mozkids-talents',theme:'orange',symbol:'★',poster:'MOZKIDS TALENTS',origin:'original',illustrativeDate:true},
  {id:'stv-013',title:'Especial Reportagem',category:'Informação',date:'2026-02-21',duration:52,description:'Reportagens investigativas e histórias aprofundadas sobre o país.',url:'https://www.stvplay.co.mz/informacao',theme:'mint',symbol:'◎',poster:'ESPECIAL REPORTAGEM',image:'assets/posters/especial-reportagem.jpg',origin:'original',illustrativeDate:true},
  {id:'stv-014',title:'As Nossas Estrelas',category:'Entretenimento',date:'2026-05-05',duration:59,description:'Antigos concorrentes de programas de talento partilham os seus projectos e experiências.',url:'https://www.stvplay.co.mz/as-nossas-estrelas/season%3A1',theme:'pink',symbol:'✳',poster:'AS NOSSAS ESTRELAS',image:'assets/posters/as-nossas-estrelas.jpg',origin:'original',illustrativeDate:true},
  {id:'stv-015',title:'Festival de Vozes — A Primeira Batalha',category:'Entretenimento',date:'2026-10-12',duration:216,description:'Uma edição do Festival de Vozes destacada no catálogo STV Play.',url:'https://www.stvplay.co.mz/series-1',theme:'rose',symbol:'✦',poster:'VOZES',origin:'original',illustrativeDate:true},
  {id:'stv-016',title:'Vida Plena',category:'Variedades',date:'2026-05-10',duration:65,description:'Mensagens de reflexão e inspiração apresentadas no STV Play.',url:'https://www.stvplay.co.mz/variedades',theme:'green',symbol:'✳',poster:'VIDA PLENA',origin:'original',illustrativeDate:true},
  {id:"stv-017",title:"Comentário de Rogério Uthui",category:"Informação",date:"2026-09-01",duration:40,description:"Análise de temas da actualidade moçambicana e reflexões sobre a sociedade.",url:"https://www.stvplay.co.mz/informacao",theme:"rose",symbol:"✷",poster:"COMENTÁRIO DE ROGÉRIO UTHUI",image:"assets/posters/comentario-rogerio-uthui.jpg",origin:"original",illustrativeDate:true},
  {id:"stv-018",title:"Reportagem da Semana",category:"Informação",date:"2026-08-15",duration:50,description:"Reportagens sobre acontecimentos e desafios da sociedade moçambicana.",url:"https://www.stvplay.co.mz/informacao",theme:"mint",symbol:"◎",poster:"REPORTAGEM DA SEMANA",image:"assets/posters/reportagem-da-semana.jpg",origin:"original",illustrativeDate:true},
  {id:"stv-019",title:"Linha Aberta",category:"Informação",date:"2026-08-05",duration:55,description:"Espaço de participação e opiniões dos telespectadores sobre questões do país.",url:"https://www.stvplay.co.mz/informacao",theme:"green",symbol:"✧",poster:"LINHA ABERTA",image:"assets/posters/linha-aberta.jpg",origin:"original",illustrativeDate:true},
  {id:"stv-020",title:"O País Económico",category:"Informação",date:"2026-07-20",duration:60,description:"Análise e debate da realidade económica e financeira de Moçambique.",url:"https://www.stvplay.co.mz/informacao",theme:"mint",symbol:"◉",poster:"O PAÍS ECONÓMICO",image:"assets/posters/o-pais-economico.jpg",origin:"original",illustrativeDate:true},
  {id:"stv-021",title:"Hora e Meia",category:"Informação",date:"2026-06-24",duration:90,description:"Debates aprofundados sobre os assuntos de maior interesse público.",url:"https://www.stvplay.co.mz/informacao",theme:"rose",symbol:"◈",poster:"HORA E MEIA",image:"assets/posters/hora-e-meia.jpg",origin:"original",illustrativeDate:true},
  {id:"stv-022",title:"Observatório Internacional",category:"Informação",date:"2026-07-18",duration:55,description:"Análise de acontecimentos internacionais e temas geopolíticos.",url:"https://www.stvplay.co.mz/informacao",theme:"cobalt",symbol:"✦",poster:"OBSERVATÓRIO INTERNACIONAL",origin:"original",illustrativeDate:true},
  {id:"stv-023",title:"Eleições Gerais 2024",category:"Informação",date:"2024-10-09",duration:90,description:"Conteúdos especiais relacionados com o processo eleitoral moçambicano de 2024.",url:"https://www.stvplay.co.mz/informacao",theme:"violet",symbol:"✷",poster:"ELEIÇÕES GERAIS 2024",origin:"original",illustrativeDate:true},
  {id:"stv-024",title:"Manhãs Alegres",category:"Entretenimento",date:"2026-10-12",duration:180,description:"Programa matinal com cultura, saúde, gastronomia e convidados especiais.",url:"https://www.stvplay.co.mz/manhas-alegres",theme:"mint",symbol:"✿",poster:"MANHÃS ALEGRES",image:"assets/posters/manhas-alegres.jpg",origin:"original",illustrativeDate:true},
  {id:"stv-025",title:"Casa Cheia",category:"Entretenimento",date:"2026-10-07",duration:180,description:"Música, dança, poesia e cultura com artistas e convidados.",url:"https://www.stvplay.co.mz/casa-cheia",theme:"rose",symbol:"✦",poster:"CASA CHEIA",image:"assets/posters/casa-cheia.jpg",origin:"original",illustrativeDate:true},
  {id:"stv-026",title:"Mais Mulher",category:"Entretenimento",date:"2026-08-21",duration:75,description:"Conversas e debates sobre temas que afectam a vida das mulheres.",url:"https://www.stvplay.co.mz/mais-mulher",theme:"pink",symbol:"✳",poster:"MAIS MULHER",image:"assets/posters/mais-mulher.jpg",origin:"original",illustrativeDate:true},
  {id:"stv-027",title:"Sabadar",category:"Entretenimento",date:"2026-07-10",duration:90,description:"Programa de entretenimento e convivência com música e convidados.",url:"https://www.stvplay.co.mz/browse",theme:"violet",symbol:"✷",poster:"SABADAR",image:"assets/posters/sabadar.jpg",origin:"original",illustrativeDate:true},
  {id:"stv-028",title:"Sabes Mais Do Que Nós?",category:"Entretenimento",date:"2026-06-01",duration:55,description:"Programa de entretenimento com perguntas e desafios de conhecimento.",url:"https://www.stvplay.co.mz/browse",theme:"orange",symbol:"✷",poster:"SABES MAIS DO QUE NÓS?",image:"assets/posters/sabes-mais-do-que-nos.jpg",origin:"original",illustrativeDate:true},
  {id:"stv-029",title:"A Caminho do Fama",category:"Variedades",date:"2026-05-28",duration:45,description:"Bastidores e castings do Fama Show em diferentes regiões de Moçambique.",url:"https://www.stvplay.co.mz/variedades",theme:"rose",symbol:"✦",poster:"A CAMINHO DO FAMA",origin:"original",illustrativeDate:true},
  {id:"stv-030",title:"Diálogo Nacional Inclusivo",category:"Variedades",date:"2026-02-14",duration:80,description:"Conteúdos sobre os debates nacionais de reconciliação, participação e desenvolvimento.",url:"https://www.stvplay.co.mz/variedades",theme:"blue",symbol:"◎",poster:"DIÁLOGO NACIONAL INCLUSIVO",origin:"original",illustrativeDate:true}
]);

/* ============================================================
   1. CONFIGURAÇÃO DO ARMAZENAMENTO LOCAL
   ============================================================ */

/**
 * Define as chaves utilizadas para guardar e recuperar
 * os dados da aplicação no localStorage do navegador.
 *
 * catalog       - Catálogo de programas da versão actual (V2).
 * legacyCatalog - Catálogo da primeira versão (V1), utilizado
 *                 para permitir a migração dos dados anteriores.
 * favorites     - Lista de identificadores dos programas favoritos.
 *
 * Estas chaves permitem conservar os dados após actualizar
 * ou voltar a abrir a página no mesmo navegador.
 */
 
const KEYS={catalog:'stvplay_redesign_catalog_v2',legacyCatalog:'stvplay_redesign_catalog_v1',favorites:'stvplay_redesign_favorites_v1'};

/**
 * Conjunto de identificadores dos 16 programas da versão V1.
 *
 * São gerados automaticamente os códigos stv-001 até stv-016.
 * A estrutura Set permite verificar rapidamente a existência
 * de um identificador, evitando elementos duplicados.
 *
 * Este conjunto é utilizado na migração dos dados para
 * preservar as remoções realizadas pelo utilizador na V1.
 */
const LEGACY_IDS=new Set(Array.from({length:16},(_,i)=>'stv-'+String(i+1).padStart(3,'0')));

/* ============================================================
   2. CONFIGURAÇÃO DAS CATEGORIAS E DA INTERFACE
   ============================================================ */

/**
 * Define as categorias disponíveis para classificar
 * os programas no catálogo.
 *
 * Estas categorias são utilizadas nos formulários,
 * nos filtros de pesquisa e na organização dos conteúdos.
 */
const CATEGORIES=['Informação','Entretenimento','Variedades'];

/**
 * Define os temas visuais utilizados nas capas gráficas.
 *
 * Cada valor corresponde a um estilo definido no CSS.
 * Os temas permitem apresentar capas alternativas quando
 * um programa não possui uma imagem associada.
 */
const THEMES=['rose','blue','violet','orange','mint','green','pink','cobalt'];

/**
 * Identifica as secções disponíveis na aplicação.
 *
 * Estes identificadores são utilizados pelo JavaScript
 * para controlar a navegação entre as diferentes páginas
 * internas, sem necessidade de recarregar o documento HTML.
 */
const VIEWS=['inicio','catalogo','directo','favoritos','gestao','sobre'];

/* ============================================================
   3. FUNÇÕES AUXILIARES PARA MANIPULAÇÃO DO DOM
   ============================================================ */

/**
 * Selecciona o primeiro elemento HTML correspondente
 * ao selector CSS fornecido.
 *
 * @param {string} s - Selector CSS do elemento.
 * @returns {Element|null} Elemento encontrado ou null.
 */
const q=s=>document.querySelector(s);

/**
 * Selecciona todos os elementos HTML correspondentes
 * ao selector CSS fornecido.
 *
 * Converte a NodeList devolvida pelo querySelectorAll()
 * num Array, permitindo utilizar métodos como forEach().
 *
 * @param {string} s - Selector CSS dos elementos.
 * @returns {Element[]} Array com os elementos encontrados.
 */
const qa=s=>Array.from(document.querySelectorAll(s));

/* ============================================================
   4. FUNÇÃO AUXILIAR PARA REPOSIÇÃO DO CATÁLOGO
   ============================================================ */

/**
 * Cria uma cópia independente dos objectos existentes
 * no catálogo inicial (INITIAL_CATALOG).
 *
 * O operador spread (...) permite copiar as propriedades
 * de cada programa para um novo objecto.
 *
 * Esta operação evita modificar directamente os objectos
 * originais quando são realizadas alterações no catálogo.
 *
 * @returns {Object[]} Array com cópias dos programas iniciais.
 */
const cloneInitial=()=>INITIAL_CATALOG.map(item=>({...item}));

/* ============================================================
   5. ESTADO GLOBAL DA APLICAÇÃO
   ============================================================ */

/**
 * Armazena os dados e as configurações dinâmicas da aplicação.
 *
 * Propriedades:
 *
 * items            - Lista actual dos programas.
 * favorites        - Conjunto de programas favoritos.
 * view             - Secção actualmente apresentada.
 * filter           - Categoria seleccionada no catálogo.
 * search           - Texto introduzido na pesquisa global.
 * sort             - Critério de ordenação seleccionado.
 * manageSearch     - Texto da pesquisa na gestão de conteúdos.
 * editId           - Identificador do programa em edição.
 * detailId         - Identificador do programa em visualização.
 * pendingConfirm   - Acção que aguarda confirmação do utilizador.
 * storageAvailable - Indica se o armazenamento está disponível.
 *
 * O objecto state permite centralizar o controlo dos dados,
 * facilitando a actualização da interface através do JavaScript.
 */
const state={
	items:[],
	favorites:new Set(),
	view:'inicio',
	filter:'Todos',
	search:'',
	sort:'recent',
	manageSearch:'',
	editId:null,
	detailId:null,
	pendingConfirm:null,
	storageAvailable:true
	};
	
/* ============================================================
   6. CONTROLO DAS NOTIFICAÇÕES
   ============================================================ */

/**
 * Guarda o identificador do temporizador utilizado
 * para controlar a duração das mensagens de notificação
 * apresentadas ao utilizador (toast).
 *
 * A variável utiliza let porque o seu valor pode ser
 * actualizado durante a execução da aplicação.
 */	
let toastTimer;

/* ============================================================
   FUNÇÕES DE PERSISTÊNCIA E VALIDAÇÃO DOS DADOS
   ============================================================ */
/**
 * Lê um valor do localStorage através da chave indicada.
 * Converte os dados de JSON para um objecto JavaScript.
 *
 * @param {string} key - Chave do registo.
 * @returns {*} Dados recuperados ou null em caso de falha.
 */
function safelyRead(key){
	try{
		const s=localStorage.getItem(key);
	return s===null?null:JSON.parse(s);
	}
	catch{return null;}
}

/**
 * Guarda dados no localStorage no formato JSON.
 *
 * @param {string} key - Chave do registo.
 * @param {*} data - Dados que serão armazenados.
 * @returns {boolean} true se guardar; false em caso de falha.
 */
function safelyWrite(key,data){
	try{localStorage.setItem(key,JSON.stringify(data));
	return true;
	}
	catch{state.storageAvailable=false;return false;}
}

/**
 * Valida a estrutura e os atributos de um programa
 * recuperado do armazenamento local.
 *
 * @param {Object} item - Programa a validar.
 * @returns {boolean} true se o registo for válido.
 */	
function validStored(item){
	return item&&typeof item.id==='string'&&typeof item.title==='string'&&typeof item.description==='string'&&CATEGORIES.includes(item.category)&&/^\d{4}-\d{2}-\d{2}$/.test(item.date)&&Number.isFinite(Number(item.duration))&&Number(item.duration)>0&&Number(item.duration)<=1440&&typeof item.url==='string';
}


/**
 * Recupera o catálogo e os favoritos armazenados no navegador.
 *
 * Valida os registos, assegura a compatibilidade com versões
 * anteriores e preserva as alterações feitas pelo utilizador.
 *
 * Quando não existem dados guardados, carrega o catálogo inicial.
 */
function loadState() {
    // 1. RECUPERAÇÃO DOS DADOS ARMAZENADOS
    // Procura primeiro o catálogo actual e, caso não exista,
    // tenta recuperar os dados da versão anterior.
    const persisted = safelyRead(KEYS.catalog);
    const legacy = persisted === null
        ? safelyRead(KEYS.legacyCatalog)
        : null;
    const savedItems = Array.isArray(persisted)
        ? persisted
        : (Array.isArray(legacy) ? legacy : null);
    // 2. PREPARAÇÃO E VALIDAÇÃO DOS REGISTOS
    // Cria um mapa do catálogo inicial, permitindo localizar
    // rapidamente um programa através do seu identificador.
    const defaults = new Map(
        INITIAL_CATALOG.map(item => [item.id, item])
    );
    // Normaliza os dados recuperados, validando a imagem,
    // o tema visual e a origem de cada programa.
    const sanitize = item => ({
        ...item,
        image: POSTER_PATH_RE.test(String(item.image || ''))
            ? item.image
            : '',

        theme: THEMES.includes(item.theme)
            ? item.theme
            : 'violet',
	 // Manter os valores internos de origem:
	  // 'original' = registo do catálogo inicial;
	  // 'local' = registo criado ou editado no navegador.
	  //
	  // As designações apresentadas na interface são definidas
	  // pela função renderManage().
        origin: item.origin === 'original'
            ? 'original'
            : 'local'
    });

    // 3. RECUPERAÇÃO E ACTUALIZAÇÃO DO CATÁLOGO
    if (savedItems) {
        state.items = savedItems
            .filter(validStored)
            .slice(0, 300)
            .map(item => {
                const fresh = defaults.get(item.id);
                // Actualiza os programas originais com os dados
                // mais recentes definidos no catálogo inicial.
                // Os programas editados pelo utilizador, cuja
                // origem é "local", mantêm as suas alterações.
                return sanitize(
                    item.origin === 'original' && fresh
                        ? { ...item, ...fresh }
                       : item
                );
            });

        // 4. MIGRAÇÃO DOS DADOS DA VERSÃO ANTERIOR
        if (legacy !== null && persisted === null) {

            // Adiciona os programas introduzidos na V2,
            // sem recuperar os programas da V1 que tenham
            // sido removidos anteriormente pelo utilizador.
            const found = new Set(
                state.items.map(item => item.id)
            );
            INITIAL_CATALOG.forEach(item => {

                if (
                    !LEGACY_IDS.has(item.id) &&
                    !found.has(item.id)
                ) {
                    state.items.push({ ...item });
                }
            });
            // Guarda o catálogo migrado na versão actual.
            safelyWrite(KEYS.catalog, state.items);
        }

    } else {

        // Carrega o catálogo inicial quando não existem
        // registos previamente guardados.
        state.items = cloneInitial();
    }
    // 5. RECUPERAÇÃO E VALIDAÇÃO DOS FAVORITOS
    // Recupera os identificadores dos favoritos guardados.
    const saved = safelyRead(KEYS.favorites);

    state.favorites = new Set(
        Array.isArray(saved)
            ? saved.filter(id => typeof id === 'string')
            : []
    );
    // Remove referências a programas que já não existem
    // no catálogo, assegurando a consistência dos favoritos.
    state.favorites = new Set(
        [...state.favorites].filter(id =>
            state.items.some(item => item.id === id)
        )
    );
}


/**
 * Guarda o catálogo actualizado no localStorage.
 *
 * @returns {boolean} Indica se a gravação foi bem-sucedida.
 */
function persistCatalog(){
	return safelyWrite(KEYS.catalog,state.items);
}

/**
 * Guarda a lista de programas favoritos no localStorage.
 *
 * @returns {boolean} Indica se a gravação foi bem-sucedida.
 */
function persistFavorites(){
	return safelyWrite(KEYS.favorites,[...state.favorites]);
}

/**
 * Apresenta uma notificação temporária ao utilizador,
 * informando o resultado de uma operação.
 *
 * @param {string} message - Mensagem apresentada.
 */
function announce(message){
	const el=q('#toast');
	el.textContent=message+(state.storageAvailable?'':' (apenas nesta sessão)');
	el.classList.add('is-visible');
	clearTimeout(toastTimer);
	toastTimer=setTimeout(()=>el.classList.remove('is-visible'),3400);
}

/**
 * Cria um ícone SVG utilizando o identificador fornecido.
 *
 * @param {string} name - Nome do ícone.
 * @returns {SVGElement} Elemento SVG criado.
 */
function icon(name){
	const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
	svg.classList.add('icon');
	svg.setAttribute('aria-hidden','true');
	const use=document.createElementNS('http://www.w3.org/2000/svg','use');
	use.setAttribute('href','#i-'+name);
	svg.append(use);return svg;
}

/**
 * Cria um elemento HTML e define opcionalmente
 * a classe CSS e o conteúdo textual.
 *
 * @param {string} tag - Nome do elemento HTML.
 * @param {string} className - Classe CSS.
 * @param {string} text - Conteúdo textual.
 * @returns {HTMLElement} Elemento HTML criado.
 */
function node(tag,className,text){
	const e=document.createElement(tag);
	if(className)e.className=className;
	if(text!==undefined)e.textContent=text;
	return e;
}

/**
 * Formata uma data para apresentação na interface,
 * utilizando o padrão regional português de Moçambique (pt-MZ).
 *
 * @param {string} value - Data no formato AAAA-MM-DD.
 * @returns {string} Data formatada para apresentação.
 */
function formatDate(value){
	const [year,month,day]=value.split('-').map(Number);
	return new Intl.DateTimeFormat('pt-MZ',{day:'2-digit',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(Date.UTC(year,month-1,day)));
}

/**
 * Normaliza um texto para facilitar a pesquisa,
 * ignorando diferenças entre maiúsculas, minúsculas e acentos.
 *
 * @param {string} text - Texto a normalizar.
 * @returns {string} Texto normalizado.
 */
function normalize(text){
	return String(text||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
}

/**
 * Determina o tema visual associado à capa de um programa.
 * Caso o tema não seja válido, utiliza o tema padrão "violet".
 *
 * @param {Object} item - Objecto com os dados do programa.
 * @returns {string} Nome do tema visual.
 */
function programTheme(item){
	return THEMES.includes(item.theme)?item.theme:'violet';
}

/**
 * Verifica se um endereço URL é válido e pertence
 * ao domínio oficial do STV Play, utilizando HTTPS.
 *
 * @param {string} raw - Endereço URL a validar.
 * @returns {boolean} true se o URL for permitido; caso contrário, false.
 */
function isTrustedUrl(raw){
	try{
		const u=new URL(raw);
		return u.protocol==='https:'&&(u.hostname==='stvplay.co.mz'||u.hostname==='www.stvplay.co.mz');
		}catch{return false;}
}

/* ============================================================
   VALIDAÇÃO DOS FICHEIROS DE IMAGEM
   ============================================================ */

/**
 * Valida o nome de um ficheiro de imagem, permitindo apenas
 * caracteres alfanuméricos, hífenes e underscores.
 * Aceita os formatos AVIF, WebP, JPG, JPEG e PNG.
 */
const POSTER_NAME_RE=/^[a-z0-9][a-z0-9_-]{0,89}\.(?:avif|webp|jpe?g|png)$/i;

/**
 * Valida o caminho relativo de uma capa, restringindo-o
 * à pasta assets/posters/ e aos formatos permitidos.
 *
 * Impede a utilização de URLs externas e sequências de
 * navegação para outros directórios (path traversal).
 */
const POSTER_PATH_RE=/^assets\/posters\/[a-z0-9][a-z0-9_-]{0,89}\.(?:avif|webp|jpe?g|png)$/i;

/**
 * Constrói o caminho relativo de uma capa, utilizando
 * o nome do ficheiro e a pasta assets/posters/.
 * Valida o nome para impedir referências a caminhos externos.
 *
 * @param {string} name - Nome do ficheiro da capa.
 */
function posterPath(name){
  const input=String(name||'').trim();
  const file=input.startsWith('assets/posters/')?input.slice('assets/posters/'.length):input;
  return POSTER_NAME_RE.test(file)?'assets/posters/'+file:'';
}

/**
 * Extrai o nome do ficheiro a partir da referência
 * de imagem associada a um programa.
 *
 * @param {string} image - Caminho ou referência da imagem.
 */
function posterFileName(image){
	return POSTER_PATH_RE.test(String(image||''))?image.slice('assets/posters/'.length):'';
}

/**
 * Actualiza a pré-visualização da capa no formulário
 * de gestão de conteúdos, verificando se a imagem
 * indicada pode ser apresentada.
 */
function updatePosterPreview(){
  const file=q('#field-image').value.trim();
  const img=q('#poster-preview-image');
  const message=q('#poster-preview-message');
  img.hidden=true;
  img.removeAttribute('src');
  if(!file){message.textContent='Campo vazio: escreva o nome da capa acima (ex.: grande-entrevista.avif). Sem esse nome será apresentada a capa gráfica.';return;}
  const path=posterPath(file);
  if(!path){message.textContent='Nome inválido. Use, por exemplo, grande-entrevista.avif (sem pastas).';
  return;
  }
  message.textContent='A verificar imagem em '+path+'...';
  img.onload=()=>{img.hidden=false;message.textContent='Capa encontrada. Será apresentada no catálogo.';};
  img.onerror=()=>{img.hidden=true;message.textContent='Não encontrei '+path+'. Confirme o nome, a extensão e se o ficheiro está na pasta assets/posters/.';};
  img.src=path;
}

/* ============================================================
   CONTROLO DA PESQUISA AUTOMÁTICA DE CAPAS
   ============================================================ */

/*
 * Controla a sugestão automática de imagens com base no
 * título do programa, procurando apenas ficheiros locais
 * na pasta assets/posters/ e nos formatos permitidos.
 *
 * Os nomes introduzidos manualmente não são substituídos.
 */

/**
 * Guarda o identificador do temporizador utilizado
 * para controlar a execução da pesquisa automática.
 */
let posterSearchTimer = null;

/**
 * Identifica a pesquisa mais recente, permitindo
 * ignorar resultados de pesquisas anteriores.
 */
let posterSearchToken = 0;

/**
 * Indica se o nome da capa foi alterado manualmente,
 * evitando que a sugestão automática o substitua.
 */
let posterNameWasEdited = false;


/**
 * Converte o título de um programa num nome normalizado,
 * adequado à pesquisa automática do ficheiro da capa.
 *
 * @param {string} title - Título do programa.
 * @returns {string} Nome normalizado para pesquisa.
 */
function titleToPosterSlug(title){
  return normalize(title).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}


/**
 * Agenda a pesquisa automática de uma capa com base no
 * título introduzido no formulário.
 *
 * Controla a temporização e evita substituir nomes
 * de ficheiros definidos manualmente pelo utilizador.
 */
function schedulePosterSuggestion(){
  clearTimeout(posterSearchTimer);
  const token=++posterSearchToken;
  const imageField=q('#field-image');
  const title=q('#field-title').value.trim();
  if(posterNameWasEdited||imageField.value.trim()||title.length<3)return;
  const slug=titleToPosterSlug(title);
  if(!slug||slug.length>90)return;
  posterSearchTimer=setTimeout(()=>{
    const extensions=['avif','webp','jpg','jpeg','png'];
    const searchExtension=(index)=>{
      if(token!==posterSearchToken||posterNameWasEdited||imageField.value.trim())return;
      if(index>=extensions.length)return;
      const filename=slug+'.'+extensions[index];
      if(!POSTER_NAME_RE.test(filename))return;
      const probe=new Image();
      probe.onload=()=>{
        if(token!==posterSearchToken||posterNameWasEdited||imageField.value.trim())return;
        imageField.value=filename;
        updatePosterPreview();
        q('#poster-preview-message').textContent='Capa detectada: '+filename+'. A verificar pré-visualização...';
      };
      probe.onerror=()=>searchExtension(index+1);
      probe.src=posterPath(filename);
    };
    searchExtension(0);
  },300);
}


/**
 * Pesquisa programas através de uma busca sequencial,
 * combinando o termo pesquisado com o filtro de categoria.
 *
 * A pesquisa percorre os programas e compara os campos
 * título, categoria e descrição, ignorando diferenças
 * de acentuação e letras maiúsculas ou minúsculas.
 *
 * Complexidade: O(n × L), considerando o processamento
 * dos textos, onde n representa o número de programas
 * e L o comprimento médio dos textos analisados.
 *
 * @param {Object[]} items - Lista de programas.
 * @param {string} term - Termo utilizado na pesquisa.
 * @param {string} category - Categoria seleccionada.
 * @returns {Object[]} Programas que satisfazem os critérios.
 */
function findPrograms(items, term, category) {
    // Normaliza o termo pesquisado para facilitar a comparação.
    const needle = normalize(term);
    // Percorre os programas, aplicando os critérios de pesquisa.
    return items.filter(item => {
        const matchesCategory =
            category === 'Todos' || item.category === category;
        const matchesText =
            !needle ||
            normalize([
                item.title,
                item.category,
                item.description
            ].join(' ')).includes(needle);
        return matchesCategory && matchesText;
    });
}


/**
 * Ordena os programas de acordo com o critério seleccionado:
 * data (mais recentes ou antigos), título ou duração.
 *
 * Utiliza o método sort() sobre uma cópia do array,
 * preservando a ordem dos dados recebidos.
 *
 * Complexidade típica: O(n log n) comparações,
 * dependendo da implementação e dos dados.
 *
 * @param {Object[]} items - Lista de programas.
 * @param {string} sort - Critério de ordenação.
 * @returns {Object[]} Nova lista com os programas ordenados.
 */
function sortedPrograms(items, sort) {
    // Cria uma cópia do array para preservar a lista original.
    const arr = [...items];
    // Define a comparação alfabética dos títulos em português,
    // ignorando diferenças entre maiúsculas e acentuação.
    const names = (a, b) =>
        a.title.localeCompare(b.title, 'pt', {
            sensitivity: 'base'
        });
    // Aplica a ordenação conforme o critério seleccionado.
    switch (sort) {
        // Ordena por data crescente (mais antigos primeiro).
        case 'oldest':
            return arr.sort((a, b) =>
                a.date.localeCompare(b.date) || names(a, b)
            );
        // Ordena os títulos alfabeticamente de A a Z.
        case 'az':
            return arr.sort(names);

        // Ordena os títulos alfabeticamente de Z a A.
        case 'za':
            return arr.sort((a, b) => names(b, a));
        // Ordena por duração decrescente (maior para menor).
        case 'duration':
            return arr.sort((a, b) =>
                b.duration - a.duration || names(a, b)
            );
        // Ordenação padrão: mais recentes primeiro.
        default:
            return arr.sort((a, b) =>
                b.date.localeCompare(a.date) || names(a, b)
            );
    }
}

/**
 * Cria a representação visual da capa de um programa.
 *
 * Utiliza a imagem associada ao conteúdo ou uma capa
 * gráfica alternativa quando não existe imagem válida.
 *
 * @param {Object} item - Dados do programa.
 * @param {boolean} detail - Indica se a capa será
 * apresentada na visualização detalhada.
 * @returns {HTMLElement} Elemento HTML da capa.
 */
function createCover(item,detail=false){
  const cover=node(detail?'div':'button',detail?'detail-cover':'program-card-cover');
  cover.classList.add('theme-'+programTheme(item));
  if(!detail){
	  cover.type='button';
	  cover.setAttribute('aria-label','Ver detalhes de '+item.title);cover.addEventListener('click',()=>showDetails(item.id));
  }
  const addIllustration=()=>{
    cover.classList.remove('has-image');
    const artIndex=node('span','card-art-index',item.category.toUpperCase());
    const symbol=node('span','card-art-icon',item.symbol||'✦');
    const display=node('span',detail?'detail-art-copy':'card-cover-name',item.poster||item.title);
    cover.append(artIndex,symbol,display);
    if(!detail)cover.append(node('span','card-art-footer','STV PLAY / EXPERIÊNCIA NOVA'));
  };
  if(item.image&&POSTER_PATH_RE.test(item.image)){
    const picture=node('img','program-poster');
    picture.src=item.image;
    picture.alt='Capa de '+item.title;
    picture.loading=detail?'eager':'lazy';
    picture.decoding='async';
    picture.addEventListener('error',()=>{picture.remove();addIllustration();},{once:true});
    cover.classList.add('has-image');
    cover.append(picture);
  }else addIllustration();
  return cover;
}


/**
 * Cria um cartão visual para apresentar um programa
 * no catálogo, incluindo capa, informações e opções
 * de interacção, como adicionar aos favoritos.
 *
 * @param {Object} item - Dados do programa.
 * @returns {HTMLElement} Elemento HTML do cartão.
 */
function createCard(item){
	const card=node('article','program-card');
	const cover=createCover(item);
	const fav=node('button','card-fav'+(state.favorites.has(item.id)?' is-favorite':''));
	fav.type='button';fav.setAttribute('aria-label',(state.favorites.has(item.id)?'Remover dos favoritos: ':'Adicionar aos favoritos: ')+item.title);fav.setAttribute('aria-pressed',state.favorites.has(item.id)?'true':'false');
	fav.append(icon('heart'));fav.addEventListener('click',()=>toggleFavorite(item.id));
	const meta=node('div','card-meta');
	meta.append(node('span','',item.category),node('span','meta-sep'),node('span','',item.duration+' min'));
	const title=node('button','card-title',item.title);
	title.type='button';title.addEventListener('click',()=>showDetails(item.id));
	const description=node('p','card-description',item.description);
	card.append(cover,fav,meta,title,description);
	if(item.origin==='local')card.append(node('span','card-origin','● INSERIDO / EDITADO LOCALMENTE'));
	return card;
}

/* ============================================================
   APRESENTAÇÃO DINÂMICA DOS CONTEÚDOS
   ============================================================ */
/**
 * Preenche um elemento HTML com os cartões dos programas,
 * gerados dinamicamente a partir da lista fornecida.
 *
 * @param {HTMLElement} target - Elemento que recebe os cartões.
 * @param {Object[]} items - Lista de programas a apresentar.
 */
function fillCards(target,items){
	const frag=document.createDocumentFragment();
	items.forEach(item=>frag.append(createCard(item)));
	target.replaceChildren(frag);
}


/**
 * Actualiza os conteúdos apresentados na página inicial,
 * incluindo os programas em destaque e outras secções.
 */
function renderHome(){
	const featured=state.items.filter(item=>['stv-001','stv-002','stv-003','stv-005'].includes(item.id));
	const fallback=state.items.filter(item=>!featured.includes(item));
	const picks=[...featured,...fallback].slice(0,4);
	fillCards(q('#featured-grid'),picks);
	if(!picks.length)q('#featured-grid').append(node('p','card-description','O catálogo está vazio. Aceda a Gerir conteúdos para adicionar programas.'));
	
}


/**
 * Actualiza o catálogo de programas, aplicando os critérios
 * de pesquisa, filtragem e ordenação seleccionados.
 *
 * Apresenta os resultados e actualiza a interface.
 */
function renderCatalog(){
	const filtered=sortedPrograms(findPrograms(state.items,state.search,state.filter),state.sort);
	fillCards(q('#catalog-grid'),filtered);
	q('#catalog-summary').textContent=filtered.length+' '+(filtered.length===1?'conteúdo encontrado':'conteúdos encontrados')+(state.search?' para “'+state.search+'”':'');
	q('#catalog-empty').hidden=filtered.length!==0;
	qa('[data-filter]').forEach(btn=>{const selected=btn.dataset.filter===state.filter;
	btn.classList.toggle('is-selected',selected);
	btn.setAttribute('aria-pressed',String(selected));});
	q('#sort-select').value=state.sort;
}


/**
 * Actualiza a secção "Minha Lista", apresentando os
 * programas guardados como favoritos pelo utilizador.
 */
function renderFavorites(){
	const items=state.items.filter(item=>state.favorites.has(item.id));
	fillCards(q('#favorites-grid'),items);
	q('#favorites-empty').hidden=items.length!==0;
	q('#favorites-summary').textContent=items.length+' '+(items.length===1?'programa guardado':'programas guardados');
	q('#nav-fav-count').textContent=String(items.length);
}


/**
 * Cria um botão de acção para a gestão dos programas,
 * permitindo executar operações como editar e remover.
 *
 * @param {string} label - Texto ou descrição do botão.
 * @param {string} ic - Identificador do ícone.
 * @param {Function} fn - Função executada ao clicar.
 * @param {string} cls - Classe CSS adicional.
 * @returns {HTMLButtonElement} Botão criado.
 */
function addManageButton(label,ic,fn,cls){
	const btn=node('button','table-icon-btn manage-action '+(cls||''));
	btn.type='button';btn.setAttribute('aria-label',label);
	btn.title=label;
	btn.append(icon(ic),document.createTextNode(' '+(ic==='edit'?'Editar':'Remover')));
	btn.addEventListener('click',fn);return btn;
}



/**
 * Renderiza a tabela de gestão de conteúdos do STVPlay.
 *
 * Responsabilidades:
 * - Ordenar os programas alfabeticamente;
 * - Filtrar os registos com base na pesquisa;
 * - Construir dinamicamente as linhas da tabela;
 * - Identificar a origem de cada registo;
 * - Associar as acções de edição e remoção;
 * - Actualizar o resumo e as mensagens de lista vazia.
 *
 * A função apenas actualiza a interface (DOM).
 * Não modifica os dados do catálogo nem o localStorage.
 */
function renderManage() {

  // 1. Obter a tabela e preparar um fragmento para as novas linhas.
  const tbody = q('#manage-tbody');
  const fragment = document.createDocumentFragment();

  // 2. Normalizar o termo pesquisado, ignorando diferenças
  // de maiúsculas/minúsculas e acentuação.
  const searchTerm = normalize(
    (state.manageSearch || '').trim()
  );

  // 3. Ordenar os programas alfabeticamente (A-Z).
  // sortedPrograms() devolve uma lista ordenada.
  const sortedItems = sortedPrograms(state.items, 'az');

  // 4. Filtrar os programas pelo título, categoria ou descrição.
  // Sem termo de pesquisa, apresentar todos os registos.
  const filteredItems = searchTerm
    ? sortedItems.filter(item => {

        const searchableText = normalize(
          item.title + ' ' +
          item.category + ' ' +
          item.description
        );

        return searchableText.includes(searchTerm);
      })
    : sortedItems;

  // 5. Construir uma linha para cada programa seleccionado.
  for (const item of filteredItems) {

    const tr = node('tr');

    // Os registos criados ou editados localmente utilizam
    // uma classe CSS própria para destaque visual.
    const isLocal = item.origin === 'local';

    if (isLocal) {
      tr.classList.add('local-manage-row');
    }

    // Coluna: título e descrição resumida do programa.
    const tdName = node('td');

    const shortDescription =
      item.description.slice(0, 65) +
      (item.description.length > 65 ? '…' : '');

    tdName.append(
      node('span', 'manage-item-title', item.title),
      node('span', 'manage-item-sub', shortDescription)
    );

    // Coluna: categoria do programa.
    const tdCategory = node('td', '', item.category);

    // Coluna: data de referência.
    // O asterisco identifica datas ilustrativas.
    const displayDate =
      formatDate(item.date) +
      (item.illustrativeDate ? ' *' : '');

    const tdDate = node('td', '', displayDate);

    // Coluna: origem do registo na aplicação.
    // Não representa o alojamento do conteúdo no STVPlay oficial.
    const tdOrigin = node('td');

    const originLabel = isLocal
      ? 'Adicionado / editado'
      : 'Catálogo inicial';

    const originClass = isLocal
      ? 'source-badge local'
      : 'source-badge';

    tdOrigin.append(
      node('span', originClass, originLabel)
    );

    // Coluna: acções disponíveis para o programa.
    // Cada botão recebe a função correspondente ao registo.
    const tdActions = node('td', 'table-actions');

    const editButton = addManageButton(
      'Editar ' + item.title,
      'edit',
      () => openForm(item)
    );

    const deleteButton = addManageButton(
      'Remover ' + item.title,
      'trash',
      () => confirmDelete(item.id),
      'delete'
    );

    tdActions.append(editButton, deleteButton);

    // 6. Agrupar as cinco colunas na linha.
    tr.append(
      tdName,
      tdCategory,
      tdDate,
      tdOrigin,
      tdActions
    );

    // Adicionar a linha ao fragmento temporário.
    fragment.append(tr);
  }

  // 7. Substituir as linhas anteriores de uma só vez.
  // Evita acumular registos duplicados após nova renderização.
  tbody.replaceChildren(fragment);

  // 8. Actualizar o resumo da gestão de conteúdos.
  const totalRecords = state.items.length;
  const displayedRecords = filteredItems.length;

  q('#manage-summary').textContent =
    displayedRecords + ' de ' +
    totalRecords + ' registos apresentados ' +
    '(datas com * são referências ilustrativas)';

  // 9. Controlar a apresentação da mensagem de lista vazia.
  const emptyState = q('#manage-empty');

  emptyState.hidden = displayedRecords !== 0;

  // Distinguir catálogo vazio de pesquisa sem resultados.
  const emptyTitle = q('#manage-empty h2');

  if (emptyTitle) {
    emptyTitle.textContent = totalRecords === 0
      ? 'O catálogo está vazio.'
      : 'Nenhum programa corresponde à pesquisa.';
  }
}



/**
 * Actualiza as principais secções da aplicação,
 * executando as funções responsáveis pela apresentação
 * dos conteúdos, catálogo, favoritos e gestão.
 */
function renderAll(){
	renderHome();
	renderCatalog();
	renderFavorites();
	renderManage();
}

/* ============================================================
   NAVEGAÇÃO, PESQUISA E GESTÃO DE FAVORITOS
   ============================================================ */
/**
 * Limpa os campos de pesquisa global e de gestão,
 * evitando manter pesquisas anteriores ao navegar
 * entre diferentes secções do website.
 */
function clearSearches() {
    state.search = '';
    state.manageSearch = '';

    q('#search-input').value = '';
    q('#manage-search').value = '';

    renderCatalog();
    renderManage();
}


/**
 * Controla a navegação entre as secções do website,
 * apresentando a secção seleccionada e ocultando as restantes.
 *
 * Actualiza o menu e o endereço da página, permitindo
 * preservar os filtros de pesquisa quando necessário.
 *
 * @param {string} target - Identificador da secção a apresentar.
 * @param {boolean} updateHash - Indica se deve actualizar o URL.
 * @param {boolean} preserveSearch - Indica se deve manter a pesquisa.
 */
function setView(target, updateHash = true, preserveSearch = false) {
    // Verifica se a secção solicitada existe
    if (!VIEWS.includes(target)) {
        target = 'inicio';
    }
    // Limpa as pesquisas ao mudar de secção,
    // excepto quando se pretende preservar a pesquisa
    if (!preserveSearch) {
        clearSearches();
    }
    // Actualiza a secção activa
    state.view = target;
    // Mostra a secção seleccionada e oculta as restantes
    qa('.view').forEach(section => {
        const active = section.id === 'view-' + target;
        section.hidden = !active;
        section.classList.toggle('is-visible', active);
    });
    // Actualiza o estado visual do menu lateral
    qa('[data-view]').forEach(btn => {
        const active = btn.dataset.view === target;
        btn.classList.toggle('is-active', active);
        if (active) {
            btn.setAttribute('aria-current', 'page');
        } else {
            btn.removeAttribute('aria-current');
        }
    });
    // Actualiza o endereço no navegador
    if (updateHash && window.history?.replaceState) {
        history.replaceState(null, '', '#' + target);
    }
    // Volta ao topo da página
    window.scrollTo({
        top: 0,
        behavior: 'instant'
    });
}


/**
 * Abre o catálogo de programas com a categoria seleccionada,
 * aplicando o respectivo filtro aos conteúdos apresentados.
 *
 * @param {string} category - Categoria a apresentar.
 */
function goCategory(category){
	state.filter=category;renderCatalog();
	setView('catalogo');
}


/**
 * Repõe os critérios padrão de pesquisa, filtragem e
 * ordenação, permitindo visualizar novamente o catálogo
 * sem as restrições anteriormente aplicadas.
 */
function resetFilters(){
	state.filter='Todos';
	state.search='';state.sort='recent';q('#search-input').value='';
	renderCatalog();
}


/**
 * Adiciona ou remove um programa da lista de favoritos,
 * actualizando o armazenamento local e a interface.
 *
 * @param {string} id - Identificador do programa.
 */
function toggleFavorite(id){
	const item=state.items.find(content=>content.id===id);
	if(!item)
		return;
	if(state.favorites.has(id)){state.favorites.delete(id);
	announce('Removido da minha lista.');
	}else{
		state.favorites.add(id);
		announce('Adicionado à minha lista.');
		}
		persistFavorites();
		renderHome();
		renderCatalog();
		renderFavorites();
	if(state.detailId===id)refreshDetailFavorite();
}


/**
 * Actualiza o botão de favoritos na janela de detalhes,
 * reflectindo se o programa está ou não guardado na
 * lista pessoal do utilizador.
 */
function refreshDetailFavorite(){
	const active=state.favorites.has(state.detailId);
	const btn=q('#detail-favorite');
	btn.replaceChildren(icon('heart'),document.createTextNode(active?' Remover da minha lista':' Guardar na minha lista'));
	btn.setAttribute('aria-pressed',String(active));
}

/* ============================================================
   VISUALIZAÇÃO, FORMULÁRIOS E VALIDAÇÃO DOS CONTEÚDOS
   ============================================================ */
/**
 * Apresenta a janela com os detalhes de um programa,
 * incluindo a capa, descrição, duração e opções disponíveis.
 *
 * @param {string} id - Identificador do programa.
 */
function showDetails(id){
	const item=state.items.find(p=>p.id===id);
	if(!item)return;
	state.detailId=id;
	q('#detail-cover').replaceWith(createDetailReplacement(item));
	q('#detail-kicker').textContent=item.category.toUpperCase()+' / STV PLAY';
	q('#detail-title').textContent=item.title;
	q('#detail-description').textContent=item.description;const meta=q('#detail-meta');
	meta.replaceChildren(node('span','',item.duration+' minutos'),node('span','',item.illustrativeDate?'Data de referência (demonstração)':'Referência: '+formatDate(item.date)),node('span','',item.origin==='local'?'Registo local':'Catálogo original'));
	const link=q('#detail-official');
	link.hidden=!isTrustedUrl(item.url);
	if(!link.hidden)link.href=item.url;
	else link.removeAttribute('href');
	refreshDetailFavorite();
	q('#detail-edit').hidden=item.origin!=='local';
	q('#detail-delete').hidden=item.origin!=='local';
	q('#detail-dialog').showModal();
}


/**
 * Cria o elemento visual utilizado para apresentar
 * a capa do programa na janela de detalhes.
 *
 * @param {Object} item - Dados do programa.
 * @returns {HTMLElement} Elemento HTML com a capa.
 */	
function createDetailReplacement(item){
	const cover=createCover(item,true);
	cover.id='detail-cover';
	return cover;
}


/**
 * Abre o formulário de gestão de conteúdos.
 * Quando recebe um programa, preenche os campos para edição;
 * caso contrário, prepara o formulário para um novo registo.
 *
 * @param {Object|null} item - Programa a editar ou null para adicionar.
 */
function openForm(item=null){
	clearTimeout(posterSearchTimer);
	posterSearchToken++;
	posterNameWasEdited=false;
	state.editId=item?item.id:null;
	q('#content-form').reset();
	q('#form-error').hidden=true;
	q('#dialog-title').textContent=item?'Editar conteúdo':'Novo conteúdo';
	q('#submit-form').textContent=item?'Guardar alterações':'Adicionar conteúdo';
	q('#field-date').value=item?item.date:new Date().toISOString().slice(0,10);
	q('#field-duration').value=item?item.duration:45;
	if(item){
		q('#field-title').value=item.title;
		q('#field-category').value=item.category;
		q('#field-description').value=item.description;
		q('#field-url').value=item.url;
		q('#field-image').value=posterFileName(item.image);
	}
	updatePosterPreview();
	q('#content-dialog').showModal();
	q('#field-title').focus();
	schedulePosterSuggestion();
}


/**
 * Apresenta uma mensagem de erro no formulário,
 * informando o utilizador sobre dados inválidos
 * ou problemas encontrados durante a validação.
 *
 * @param {string} message - Mensagem de erro a apresentar.
 */	
function showFormError(message){
	const err=q('#form-error');
	err.textContent=message;err.hidden=false;
}


/**
 * Verifica se a data introduzida é válida e corresponde
 * ao formato esperado pela aplicação (AAAA-MM-DD).
 *
 * @param {string} input - Data a validar.
 * @returns {boolean} true se a data for válida; caso contrário, false.
 */	
function validDate(input){
	if(!/^\d{4}-\d{2}-\d{2}$/.test(input))
		return false;
	const d=new Date(input+'T00:00:00Z');
	return !Number.isNaN(d.getTime())&&d.toISOString().startsWith(input);
}

/**
 * Processa a submissão do formulário de gestão de conteúdos.
 *
 * Recolhe e valida os dados introduzidos pelo utilizador,
 * executa a adição ou edição de programas e actualiza
 * o catálogo, o armazenamento local e a interface.
 *
 * @param {SubmitEvent} event - Evento de submissão do formulário.
 */
function submitForm(event) {
    // 1. RECOLHA E PREPARAÇÃO DOS DADOS
    // Impede a submissão tradicional e o recarregamento da página.
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const title = String(data.get('title') || '').trim();
    const category = String(data.get('category') || '');
    const date = String(data.get('date') || '');
    const duration = Number(data.get('duration'));
    const description = String(data.get('description') || '').trim();
    const url = String(data.get('url') || '').trim();
    const imageName = String(data.get('image') || '').trim();
    const image = posterPath(imageName);

    // 2. VALIDAÇÃO DOS CAMPOS DO FORMULÁRIO
    // Verifica os limites, formatos e valores permitidos.
    if (title.length < 3 || title.length > 90)
        return showFormError('O título deve ter entre 3 e 90 caracteres.');
    if (!CATEGORIES.includes(category))
        return showFormError('Escolha uma categoria válida.');
    if (!validDate(date))
        return showFormError('Introduza uma data válida.');
    if (!Number.isInteger(duration) || duration < 1 || duration > 1440)
        return showFormError('A duração deve ser um número inteiro entre 1 e 1440 minutos.');
    if (description.length < 10 || description.length > 450)
        return showFormError('A descrição deve ter entre 10 e 450 caracteres.');
    if (url && !isTrustedUrl(url))
        return showFormError('A ligação deve ser HTTPS e pertencer ao domínio stvplay.co.mz.');
    // Valida o nome da capa e confirma que a imagem foi carregada.
    if (imageName && !image)
        return showFormError('Capa inválida: escreva apenas o nome do ficheiro (ex.: grande-entrevista.avif).');
    if (
        imageName &&
        (
            q('#poster-preview-image').hidden ||
            !q('#poster-preview-image').naturalWidth
        )
    ) {
        return showFormError('A imagem ainda não foi encontrada. Confirme que aparece a mensagem “Capa encontrada” antes de guardar.');
    }
    // Limita o catálogo demonstrativo a 300 programas.
    if (!state.editId && state.items.length >= 300)
        return showFormError('Limite demonstrativo de 300 conteúdos atingido.');

    // 3. ADIÇÃO OU EDIÇÃO DE PROGRAMAS
    if (state.editId) {
        // UPDATE: localiza e actualiza o programa existente.
        const idx = state.items.findIndex(
            p => p.id === state.editId
        );
        if (idx < 0)
            return showFormError('Não foi possível localizar este registo.');
        state.items[idx] = {
            ...state.items[idx],
            title,
            category,
            date,
            duration,
            description,
            url,
            image,
            origin: 'local',
            illustrativeDate: false,
            poster: title.toUpperCase()
        };
    } else {
        // CREATE: gera um identificador e adiciona um novo programa.
        const id = 'local-' + (
            globalThis.crypto?.randomUUID?.() ||
            Date.now() + '-' + Math.random().toString(36).slice(2)
        );
        state.items.push({
            id,
            title,
            category,
            date,
            duration,
            description,
            url,
            image,
            theme: THEMES[state.items.length % THEMES.length],
            symbol: '✦',
            poster: title.toUpperCase(),
            origin: 'local',
            illustrativeDate: false
        });
    }
    // 4. PERSISTÊNCIA E ACTUALIZAÇÃO DO ESTADO
    // Guarda o catálogo actualizado no armazenamento local.
    persistCatalog();
    // Fecha o formulário e repõe o estado de edição.
    q('#content-dialog').close();
    const edited = Boolean(state.editId);
    state.editId = null;

    // 5. ACTUALIZAÇÃO DA INTERFACE E FEEDBACK
    // Limpa a pesquisa global e localiza o programa na gestão.
    state.search = '';
    q('#search-input').value = '';
    state.manageSearch = title;
    q('#manage-search').value = title;

    // Actualiza os conteúdos apresentados no website.
    renderAll();
    // Informa o utilizador sobre o resultado da operação.
    announce(
        edited
            ? 'Conteúdo actualizado. Encontre Editar/Remover na tabela.'
            : 'Conteúdo adicionado. Os botões Editar e Remover estão na tabela.'
    );
    // Abre a gestão preservando a pesquisa do programa.
    setView('gestao', true, true);
}

 
/* ============================================================
   CONFIRMAÇÃO E GESTÃO DE OPERAÇÕES SOBRE O CATÁLOGO
   ============================================================ */
/**
 * Apresenta uma janela de confirmação antes de executar
 * uma operação que necessita da autorização do utilizador.
 *
 * @param {string} title - Título da janela de confirmação.
 * @param {string} description - Descrição da operação.
 * @param {Function} action - Função executada após confirmação.
 */ 
function confirmAction(title,description,action){
	q('#confirm-title').textContent=title;q('#confirm-message').textContent=description;state.pendingConfirm=action;
	q('#confirm-dialog').showModal();
}


/**
 * Solicita confirmação para remover um programa do catálogo.
 * Após a confirmação, elimina o registo e actualiza
 * o armazenamento local e a interface.
 *
 * @param {string} id - Identificador do programa a remover.
 */
function confirmDelete(id){
	const item=state.items.find(p=>p.id===id);
	if(!item)return;
	confirmAction('Remover conteúdo?','O registo “'+item.title+'” será removido apenas do catálogo local. Pode repor os conteúdos iniciais mais tarde.',()=>{state.items=state.items.filter(p=>p.id!==id);
	state.favorites.delete(id);persistCatalog();
	persistFavorites();renderAll();
	announce('Registo removido do catálogo local.');});
}


/**
 * Repõe o catálogo inicial da aplicação após confirmação
 * do utilizador, substituindo as alterações locais.
 *
 * Actualiza também os favoritos e o armazenamento local
 * para manter a consistência dos dados.
 */
function restoreInitial(){
	confirmAction('Repor catálogo inicial?','Todos os conteúdos adicionados ou alterados localmente serão substituídos pela lista inicial. Os favoritos que deixarem de existir serão removidos.',()=>{state.items=cloneInitial();state.favorites=new Set([...state.favorites].filter(id=>state.items.some(p=>p.id===id)));
	persistCatalog();
	persistFavorites();
	state.manageSearch='';
	q('#manage-search').value='';renderAll();announce('Catálogo inicial reposto.');});
}

/* ============================================================
   GESTÃO DE EVENTOS E INICIALIZAÇÃO DA APLICAÇÃO
   ============================================================ */
/**
 * Regista os eventos responsáveis pela interactividade
 * do website, associando os elementos HTML às respectivas
 * funções de navegação, pesquisa e gestão de conteúdos.
 *
 * Utiliza addEventListener() para responder às acções
 * do utilizador sem recarregar a página.
 */
function wireEvents() {
    // 1. NAVEGAÇÃO ENTRE AS SECÇÕES
    // Associa os botões do menu às respectivas secções.
    qa('[data-view]').forEach(button =>
        button.addEventListener('click', () =>
            setView(button.dataset.view)
        )
    );
    // Permite regressar à página inicial pelo logótipo.
    const link = q('[data-view-link]');

    link.addEventListener('click', event => {
        event.preventDefault();
        setView('inicio');
    });
    // Abre o catálogo com a categoria seleccionada.
    qa('[data-category]').forEach(btn =>
        btn.addEventListener('click', () =>
            goCategory(btn.dataset.category)
        )
    );
    // 2. FILTRAGEM, ORDENAÇÃO E PESQUISA
    // Filtra os programas pela categoria seleccionada.
    qa('[data-filter]').forEach(btn =>
        btn.addEventListener('click', () => {
            state.filter = btn.dataset.filter;
            renderCatalog();
        })
    );
    // Ordena o catálogo de acordo com a opção seleccionada.
    q('#sort-select').addEventListener('change', e => {
        state.sort = e.target.value;
        renderCatalog();
    });
    // Pesquisa global com actualização dinâmica dos resultados.
    q('#search-input').addEventListener('input', e => {

        const fromAnotherView = state.view !== 'catalogo';

        state.search = e.target.value;

        // Remove o filtro anterior ao iniciar uma nova pesquisa.
        if (fromAnotherView) {
            state.filter = 'Todos';
        }
        renderCatalog();

        // Abre o catálogo sem apagar o termo pesquisado.
        if (fromAnotherView) {
            setView('catalogo', true, true);
        }
    });
    // 3. ATALHO DE TECLADO PARA PESQUISA

    // A tecla "/" activa a pesquisa quando não existem
    // campos de edição ou janelas de diálogo activos.
    document.addEventListener('keydown', e => {

        if (
            e.key === '/' &&
            !['INPUT', 'TEXTAREA', 'SELECT'].includes(
                document.activeElement.tagName
            ) &&
            !qa('dialog[open]').length
        ) {
            e.preventDefault();
            q('#search-input').focus();
        }
    });
    // 4. BOTÕES DE NAVEGAÇÃO E ACESSO RÁPIDO
    // Abre o catálogo através dos botões de exploração.
    for (const sel of [
        '#hero-explore',
        '#view-all-categories',
        '#view-all-highlights',
        '#favorites-explore'
    ]) {
        q(sel).addEventListener('click', () =>
            setView('catalogo')
        );
    }
    // Apresenta os detalhes do programa em destaque.
    q('#hero-feature').addEventListener('click', () =>
        showDetails('stv-001')
    );
    // Acesso às transmissões em directo.
    q('#banner-live').addEventListener('click', () =>
        setView('directo')
    );
    // Acesso às informações sobre o projecto.
    q('#footer-about').addEventListener('click', () =>
        setView('sobre')
    );
    // Repõe os critérios de pesquisa e filtragem.
    for (const sel of ['#reset-filters', '#empty-reset']) {
        q(sel).addEventListener('click', resetFilters);
    }
    // 5. GESTÃO DE CONTEÚDOS E CAPAS

    // Abre o formulário para adicionar um novo programa.
    for (const sel of ['#header-add', '#manage-add']) {
        q(sel).addEventListener('click', () => openForm());
    }
    // Permite repor o catálogo inicial.
    q('#restore-data').addEventListener('click', restoreInitial);
    // Pesquisa programas na tabela de gestão.
    q('#manage-search').addEventListener('input', e => {
        state.manageSearch = e.target.value;
        renderManage();
    });
    // Processa a submissão do formulário de conteúdos.
    q('#content-form').addEventListener('submit', submitForm);
    // Sugere automaticamente uma capa com base no título.
    q('#field-title').addEventListener(
        'input',
        schedulePosterSuggestion
    );
    // Preserva o nome da capa introduzido manualmente.
    q('#field-image').addEventListener('input', () => {
        posterNameWasEdited = true;
        posterSearchToken++;

        clearTimeout(posterSearchTimer);
        updatePosterPreview();
    });
    // 6. JANELAS DE DETALHES E EDIÇÃO

    // Fecha o formulário de adição ou edição.
    for (const sel of ['#close-form', '#cancel-form']) {
        q(sel).addEventListener('click', () =>
            q('#content-dialog').close()
        );
    }
    // Fecha a janela de detalhes do programa.
    q('#close-detail').addEventListener('click', () =>
        q('#detail-dialog').close()
    );
    // Adiciona ou remove o programa dos favoritos.
    q('#detail-favorite').addEventListener('click', () =>
        toggleFavorite(state.detailId)
    );
    // Abre o formulário de edição do programa seleccionado.
    q('#detail-edit').addEventListener('click', () => {
        const item = state.items.find(
            p => p.id === state.detailId
        );
        q('#detail-dialog').close();
        if (item) {
            openForm(item);
        }
    });
    // Solicita a confirmação para remover o programa.
    q('#detail-delete').addEventListener('click', () => {
        const id = state.detailId;
       q('#detail-dialog').close();
        confirmDelete(id);
    });
    // 7. CONFIRMAÇÃO E ENCERRAMENTO DE JANELAS
    // Cancela a operação pendente.
    q('#confirm-cancel').addEventListener('click', () =>
        q('#confirm-dialog').close()
    );
    // Executa a operação apenas após confirmação.
    q('#confirm-accept').addEventListener('click', () => {
        const fn = state.pendingConfirm;
        state.pendingConfirm = null;
        q('#confirm-dialog').close();

        if (fn) {
            fn();
        }
    });
    // Limpa a operação pendente ao fechar a janela.
    q('#confirm-dialog').addEventListener('close', () => {
        state.pendingConfirm = null;
    });
    // Permite fechar uma janela ao clicar na área exterior.
    qa('dialog').forEach(dialog =>
        dialog.addEventListener('click', event => {
            if (event.target === dialog) {
                dialog.close();
            }
        })
    );
    // 8. NAVEGAÇÃO ATRAVÉS DO URL
    // Actualiza a secção apresentada quando o hash do URL muda.
    window.addEventListener('hashchange', () => {
        const view = location.hash.slice(1);
        if (VIEWS.includes(view)) {
            setView(view, false);
        }
    });
}


/**
 * Inicializa a aplicação, recuperando os dados guardados,
 * configurando os eventos e apresentando os conteúdos
 * correspondentes à secção inicial.
 */
function init(){
	loadState();
	wireEvents();
	renderAll();
	const initialView=location.hash.slice(1);
	setView(VIEWS.includes(initialView)?initialView:'inicio',false);
}

// Inicia a aplicação após a definição das funções.
init();
