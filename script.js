// =========================================================================
// 📁 EDIT / CREATE YOUR ITEMS HERE
// 💡 Just type ANY category name you want! The site will create the buttons automatically.
// =========================================================================
const bibliotecaMeshes = [
    {
        id: 0,
        nome: "Cyberpunk Sword V1",
        categoria: "MESHES", // Categoria Criada
        descricao: "An ultra-detailed neon sword perfect for RPG games.",
        descricaoLonga: "This sword was developed with optimization in mind for mobile and PC games on Roblox. Full UV mapping and light emission (neon) textures are included in the package.",
        imagens: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500"],
        linkDownload: "downloads/espada_cyber.zip",
        formato: ".FBX",
        tamanho: "1.2 MB"
    },
    {
        id: 1,
        nome: "Sci-Fi Robotic Torso",
        categoria: "TORSOS", // Categoria Criada
        descricao: "Stylized mechanical torso model for custom cyber characters.",
        descricaoLonga: "A complete torso ready for character package replacement (R15) in Roblox Studio.",
        imagens: ["https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=500"],
        linkDownload: "downloads/cyber_torso.zip",
        formato: ".OBJ",
        tamanho: "2.5 MB"
    },
    {
        id: 2,
        nome: "Aura Aura Effect",
        categoria: "PARTICLES", // Nova categoria inventada!
        descricao: "Cool magical particle aura for simulator power-ups.",
        descricaoLonga: "Custom particle emitter block configured for fast rendering. Easily import to Roblox Studio.",
        imagens: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500"],
        linkDownload: "downloads/particles.zip",
        formato: ".RBXM",
        tamanho: "45 KB"
    }
];

// =========================================================================
// 🚀 ENGINE - AUTOMATIC CATEGORIES & FILTER LOGIC
// =========================================================================
let filtroAtual = "ALL";
const LIMITE_CATEGORIAS_VISIVEIS = 5; // Quantos botões aparecem antes do "More +"

function gerarBotoesDeFiltro() {
    const mainFiltersContainer = document.getElementById("main-filters");
    const extraFiltersContainer = document.getElementById("extra-filters");
    
    if (!mainFiltersContainer) return;

    mainFiltersContainer.innerHTML = "";
    extraFiltersContainer.innerHTML = "";

    // 🧠 Pega todas as categorias dos produtos de forma única e organizada
    const categoriasUnicas = ["ALL", ...new Set(bibliotecaMeshes.map(item => item.categoria.toUpperCase()))];

    // Separa o que fica visível e o que vai pro menu oculto
    const visiveis = categoriasUnicas.slice(0, LIMITE_CATEGORIAS_VISIVEIS);
    const extras = categoriasUnicas.slice(LIMITE_CATEGORIAS_VISIVEIS);

    // 1. Cria os botões principais na tela
    visiveis.forEach(cat => {
        mainFiltersContainer.appendChild(criarBotaoFiltro(cat));
    });

    // 2. Se houver categorias extras, cria o botão "More +" e a aba expansível
    if (extras.length > 0) {
        const btnToggle = document.createElement("button");
        btnToggle.className = "filter-btn btn-toggle-filters";
        btnToggle.id = "btn-toggle-more";
        btnToggle.innerText = "More +";
        
        btnToggle.onclick = () => {
            const isOpen = extraFiltersContainer.classList.toggle("open");
            btnToggle.innerText = isOpen ? "Close ✕" : "More +";
        };
        
        mainFiltersContainer.appendChild(btnToggle);

        // Alimenta o menu oculto com o resto das categorias
        extras.forEach(cat => {
            extraFiltersContainer.appendChild(criarBotaoFiltro(cat));
        });
    }
}

function criarBotaoFiltro(categoriaNome) {
    const btn = document.createElement("button");
    btn.className = `filter-btn ${filtroAtual === categoriaNome ? 'active' : ''}`;
    btn.innerText = categoriaNome.charAt(0) + categoriaNome.slice(1).toLowerCase(); // Deixa bonito (Ex: Meshes)
    btn.setAttribute("data-filter", categoriaNome);

    btn.addEventListener("click", () => {
        filtroAtual = categoriaNome;
        
        // Atualiza o estado ativo visual de todos os botões de filtro
        document.querySelectorAll(".filter-btn").forEach(b => {
            if (b.getAttribute("data-filter") === filtroAtual) {
                b.classList.add("active");
            } else {
                b.classList.remove("active");
            }
        });

        renderizarBiblioteca();
    });

    return btn;
}

function renderizarBiblioteca() {
    const container = document.getElementById("lista-de-meshes");
    if (!container) return;

    container.innerHTML = "";

    const itensFiltrados = bibliotecaMeshes.filter(item => {
        return filtroAtual === "ALL" || item.categoria.toUpperCase() === filtroAtual;
    });

    if (itensFiltrados.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--texto-secundario); padding: 40px 0;">No items found in this category.</p>`;
        return;
    }

    itensFiltrados.forEach(item => {
        const card = document.createElement("div");
        card.className = "card-mesh";
        const imagemCapa = item.imagens[0] || "";

        card.innerHTML = `
            <div class="img-container" onclick="window.location.href='produto.html?id=${item.id}'">
                <span class="badge-categoria">${escapeHTML(item.categoria)}</span>
                <img src="${escapeHTML(imagemCapa)}" alt="${escapeHTML(item.nome)}">
            </div>
            <div class="card-content">
                <div onclick="window.location.href='produto.html?id=${item.id}'">
                    <h2>${escapeHTML(item.nome)}</h2>
                    <p class="descricao">${escapeHTML(item.descricao)}</p>
                    <div class="detalhes-tecnicos">
                        <div class="detalhes-linha">
                            <span class="detalhes-label">${escapeHTML(item.formato)}</span>
                            <span class="detalhes-valor">${escapeHTML(item.tamanho)}</span>
                        </div>
                    </div>
                </div>
                <a href="${escapeHTML(item.linkDownload)}" class="btn-shortcut-download" download>
                    ⬇️ Download Now
                </a>
            </div>
        `;
        container.appendChild(card);
    });
}

// =========================================================================
// 📖 IMAGE SLIDER LOGIC (Product Page)
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
        container.innerHTML = `<h2>Asset not found.</h2><a href="index.html" class="btn-back">Back to Home</a>`;
        return;
    }

    fotosDoProduto = produto.imagens;
    slideIndex = 0;
    const mostrarSetas = fotosDoProduto.length > 1 ? 'flex' : 'none';

    container.innerHTML = `
        <a href="index.html" class="btn-back">← Back to Gallery</a>
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
                <div class="detalhes-tecnicos" style="border-left: 2px solid var(--cor-acento); padding-left: 10px;">
                    <div class="detalhes-linha" style="margin-bottom: 5px;">
                        <span class="detalhes-label">File Format:</span>
                        <span class="detalhes-valor">${escapeHTML(produto.formato)}</span>
                    </div>
                    <div class="detalhes-linha">
                        <span class="detalhes-label">Disk Space:</span>
                        <span class="detalhes-valor">${escapeHTML(produto.tamanho)}</span>
                    </div>
                </div>
                <a href="${escapeHTML(produto.linkDownload)}" class="btn-download" download>
                    ⬇️ Download Complete File
                </a>
            </div>
        </div>
    `;
}

window.mudarSlide = function(direcao) {
    slideIndex += direcao;
    if (slideIndex >= fotosDoProduto.length) slideIndex = 0;
    if (slideIndex < 0) slideIndex = fotosDoProduto.length - 1;
    document.getElementById("slider-img").src = fotosDoProduto[slideIndex];
}

function escapeHTML(string) {
    return String(string).replace(/[&<>"']/g, function (s) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s];
    });
}

window.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("filter-container")) {
        gerarBotoesDeFiltro();
        renderizarBiblioteca();
    }
    if (document.getElementById("detalhe-produto")) {
        carregarPaginaProduto();
    }
});
