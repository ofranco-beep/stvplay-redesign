# STV Play — Nova Experiência Digital

**Protótipo académico independente | Disciplina: Tecnologias Web | Estudante: Oscar Franco |2026**

Redesenho conceptual de [stvplay.co.mz](https://www.stvplay.co.mz/), implementado com **HTML5 + CSS3 + JavaScript puro**, sem bibliotecas externas ou backend.

> O projecto não é afiliado ao STV Play, não replica a área comercial nem reproduz os vídeos. Os cartões usam capas recortadas de capturas de ecrã fornecidas pelo utilizador quando disponíveis, e ilustrações próprias nos restantes casos; os botões de visualização abrem páginas públicas oficiais que podem exigir acesso por subscrição.

## Como executar

1. Manter as pastas `css` e `js` junto ao `index.html`.
2. Abrir `index.html` num navegador moderno (Chrome, Edge ou Firefox).
3. Alternativamente, inicie um servidor local na pasta do projecto: `python -m http.server 8000` e aceda a `http://localhost:8000`.
4. A internet só é necessária para visitar as páginas oficiais através das ligações externas.

## Estrutura

```text
STVPlay-Redesign/
├── index.html          # Estrutura semântica, navegação, componentes e modais
├── css/style.css       # Identidade visual, Grid, Flexbox e media queries
├── js/app.js           # Catálogo, estados, validações, CRUD e algoritmos
├── assets/posters/     # 19 capas locais (recortadas das capturas do utilizador)
├── assets/previews/    # Capturas do protótipo v1 no navegador de testes
└── README.md           # Descrição, fontes, testes e instruções
```

## Funcionalidades concluídas

- **Início:** banner, categorias e quatro programas de destaque.
- **Explorar:** 30 entradas iniciais, pesquisa por título/categoria/descrição, filtro por categoria e ordenação.
- **Em directo:** ligações a STV e STV Notícias no website oficial.
- **Minha lista:** adicionar/remover favoritos; persistência local.
- **Gerir conteúdos:** adicionar, editar, remover, repor catálogo e validar campos; confirmação antes de operações destrutivas.
- **Sobre:** tabela de comparação original × redesenho e ressalvas metodológicas.
- **Responsividade:** navegação lateral em computador, menu inferior em telemóveis.
- **Acessibilidade:** elementos semânticos, skip link, rótulos, foco visível, `dialog` nativo, alertas `role=status`, `aria-pressed` e suporte à preferência de movimento reduzido.

**Importante:** as acções CRUD alteram somente uma cópia local do catálogo no `localStorage` e não o website original. Ao editar entradas provenientes do website original, o registo passa a ser identificado como personalizado. O botão **Repor catálogo inicial** reconstrói a lista de demonstração. Em navegadores que não autorizem armazenamento local, a aplicação funciona em memória durante a sessão.


## Datas e fontes de conteúdo

Os **títulos, categorias, descrições adaptadas e ligações** foram seleccionados de páginas públicas do STV Play consultadas em **13/10/2026**. As **datas de referência** de alguns programas sem data única de publicação na página pública são **ilustrativas**, apenas para demonstrar a ordenação; aparecem identificadas com `*` na tabela de gestão e como *Data de referência (demonstração)* nos detalhes. Também algumas **durações resumidas** são valores ilustrativos para os programas, enquanto outras se baseiam em episódios expostos nas páginas oficiais. Não devem ser utilizadas como metadados editoriais definitivos.

Fontes verificadas:

- STV Play — [Informação](https://www.stvplay.co.mz/informacao)
- STV Play — [Variedades](https://www.stvplay.co.mz/variedades)
- STV Play — [Em Directo](https://www.stvplay.co.mz/canais-em-directo-1)
- STV Play — [Fama Show](https://www.stvplay.co.mz/fama-show)
- STV Play — [Jornal da Noite](https://www.stvplay.co.mz/jornal-da-noite)
- STV Play — [Pontos de Vista](https://www.stvplay.co.mz/pontos-de-vista)
- STV Play — [Noite Informativa](https://www.stvplay.co.mz/noite-informativa)
- STV Play — [Festival de Vozes](https://www.stvplay.co.mz/festival-de-vozes-1)
- W3C — [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- MDN — [JavaScript Array.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
- MDN — [Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)

## Comparação original × protótipo

| Dimensão | Original: observação pública | Proposta implementada |
|---|---|---|
| Linguagem | Algumas expressões em inglês, como *Sign in* e *seasons* | Interface de navegação em português |
| Organização | Categorias e páginas de programas disponíveis | Uma vista de catálogo com filtros e ordenação combináveis |
| Pesquisa | Não foram aferidas todas as capacidades da pesquisa original | Pesquisa dinâmica sem acentos e sem diferenciar maiúsculas |
| Gestão pública | Não é uma função destinada a espectadores | CRUD local explícito para avaliação da disciplina |
| Favoritos | Área autenticada não avaliada | Lista pessoal guardada no navegador |
| Responsividade/acessibilidade | Requerem auditoria comparativa | Media queries, teclado, foco, etiquetas e modais nativos |
| Desempenho | Não medido no original | Protótipo sem frameworks ou dependências externas; a comparação quantitativa requer medições |
