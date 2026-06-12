// =========================================================================
// 📁 ÁREA DE EDITAR / CRIAR SEUS ITENS
// =========================================================================
const bibliotecaMeshes = [
    {
        id: 0,
        nome: "Espada Cyberpunk V1",
        categoria: "MESHES",
        descricao: "Uma espada neon ultra detalhada ideal para jogos de RPG.",
        descricaoLonga: "Esta espada foi desenvolvida pensando na otimização para jogos mobile e PC no Roblox. Mapeamento UV completo e texturas de emissão de luz (neon) inclusas no pacote.",
        // 📷 VOCÊ PODE COLOCAR UMA OU MAIS FOTOS AQUI DENTRO DESSES COLCHETES:
        imagens: [
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500",
            "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=500"
        ],
        linkDownload: "downloads/espada_cyber.zip",
        formato: ".FBX",
        tamanho: "1.2 MB"
    },
    {
        id: 1,
        nome: "Tronco Robótico Sci-Fi",
        categoria: "TORSOS",
        descricao: "Modelo de Torso mecânico estilizado para personagens cibernéticos.",
        descricaoLonga: "Um torso completo pronto para substituição de pacotes de corpo (R15) no Roblox Studio. Linhas minimalistas e encaixe perfeito.",
        imagens: [
            "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=500"
        ],
        linkDownload: "downloads/cyber_torso.zip",
        formato: ".OBJ",
        tamanho: "2.5 MB"
    }
];

// =========================================================================
// 🚀 LÓGICA DO SCRIPT (Home, Filtros e Atalho de Download)
// =========================================================================
let filtroAtual = "ALL";

function renderizarBiblioteca() {
    const container = document.getElementById("lista-de-meshes");
    if (!container) return;

    container.innerHTML = "";

    const itensFiltrados = bibliotecaMeshes.filter(item => {
        return filtroAtual === "ALL" || item.categoria.toUpperCase() === filtroAtual;
    });

    if (itensFiltrados.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--texto-secundario); padding: 40px 0;">Nenhum item encontrado.</p>`;
        return;
    }

    itensFiltrados.forEach(item => {
        const card = document.createElement("div");
        card.className = "card-mesh";

        // Primeira imagem da lista serve como capa na home
        const imagemCapa = item.imagens[0] || "";

        card.innerHTML = `
            <div class="img-container" onclick="window.location.href='produto.html?id=${item.id}'">
                <span class="badge-categoria">${escapeHTML(item.categoria)}</span>
                <img src="${escapeHTML(imagemCapa)}" alt="${escapeHTML(item.nome)}">
            </div>
            <div class="card-content">
                <div onclick="window.location.href='produto.html?id=${item.id}'" style="cursor:pointer;">
                    <h2>${escapeHTML(item.nome)}</h2>
                    <p class="descricao">${escapeHTML(item.descricao)}</p>
                    
                    <div class="detalhes-tecnicos">
                        <div class="detalhes-linha">
                            <span class="detalhes-label">Formato:</span>
                            <span class="detalhes-valor">${escapeHTML(item.formato)}</span>
                        </div>
                        <div class="detalhes-linha">
                            <span class="detalhes-label">Tamanho:</span>
                            <span class="detalhes-valor">${escapeHTML(item.tamanho)}</span>
                        </div>
                    </div>
                </div>
                
                <a href="${escapeHTML(item.linkDownload)}" class="btn-shortcut-download" download>
                    ⬇️ Baixar Agora
                </a>
            </div>
        `;
        container.appendChild(card);
    });
}

function inicializarFiltros() {
    const botoes = document.querySelectorAll(".filter-btn");
    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            botoes.forEach(b => b.classList.remove("active"));
            botao.classList.add("active");
            filtroAtual = botao.getAttribute("data-filter").toUpperCase();
            renderizarBiblioteca();
        });
    });
}

// =========================================================================
// 📖 LÓGICA DO SLIDE DE IMAGENS (Página Interna)
// =========================================================================
let slideIndex = 0;
let fotosDoProduto = [];

function carregarPaginaProduto() {
    const urlParams = new URLSearchParams(window.location.search);
    const idProduto = parseInt(urlParams.get('id'));

    const produto = bibliotecaMeshes.find(item => item.id === idProduto);
    const container = document.getElementById("detalhe-produto");

    if (!container) return;

    if (!produto) {
        container.innerHTML = `<h2>Asset não encontrado.</h2><a href="index.html" class="btn-back">Voltar para a Home</a>`;
        return;
    }

    fotosDoProduto = produto.imagens;
    slideIndex = 0;

    // Verifica se precisa mostrar as setas do slide (só se tiver mais de 1 foto)
    const mostrarSetas = fotosDoProduto.length > 1 ? 'flex' : 'none';

    container.innerHTML = `
        <a href="index.html" class="btn-back">← Voltar para a Galeria</a>
        <div class="produto-wrapper">
            <div class="produto-media">
                <div class="slider-container">
                    <img id="slider-img" src="${escapeHTML(fotosDoProduto[0])}" alt="${escapeHTML(produto.nome)}">
                    <button class="slide-nav prev" style="display: ${mostrarSetas}" onclick="mudarSlide(-1)">&#10094;</button>
                    <button class="slide-nav next" style="display: ${mostrarSetas}" onclick="mudarSlide(1)">&#10095;</button>
                </div>
            </div>
            <div class="produto-info">
                <span class="badge-categoria">${escapeHTML(produto.categoria)}</span>
                <h1>${escapeHTML(produto.nome)}</h1>
                <p class="descricao-longa">${escapeHTML(produto.descricaoLonga)}</p>
                
                <div class="detalhes-tecnicos">
                    <div class="detalhes-linha">
                        <span class="detalhes-label">Formato do Arquivo:</span>
                        <span class="detalhes-
