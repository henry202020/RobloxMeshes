// =========================================================================
// 📁 EDIT / CREATE YOUR ITEMS HERE
// =========================================================================
const bibliotecaMeshes = [
    {
        id: 0,
        nome: "Female Body R6 - Female 1",
        categoria: ["BODY"], 
        descricao: "Female 1 - R6",
        descricaoLonga: "FEMALE - Includes: Torso, Legs, Arms and Torso.",
        imagens: [
            "https://i.postimg.cc/sfJL7FFH/Female-Body-R6.png", 
            "https://i.postimg.cc/MZYLVkkP/Front.png", 
            "https://i.postimg.cc/nV1WB88P/Back.png", 
            "https://i.postimg.cc/66hPnss1/Left.png", 
            "https://i.postimg.cc/DfcNLVk2/Right.png"
        ],
        linkDownload: "https://link-center.net/5591385/AFOG538Lfitj",
        formato: ".ZIP/.mesh",
        tamanho: "1.58 MB"
    },
    {
        id: 1,
        nome: "Female Body R6 - Pleasant Ana",
        categoria: ["BODY"], 
        descricao: "Pleasant Ana - R6",
        descricaoLonga: "PLEASANT ANA - Includes: Torso, Legs, Arms and Torso.",
        imagens: ["https://i.postimg.cc/T1kQS6fJ/Female-Body-R6v2-Pleasant-Ana.png"],
        linkDownload: "https://link-hub.net/5591385/XOBhNwX7PYMy",
        formato: ".ZIP/.mesh",
        tamanho: "1.20 MB"
    }
];

// =========================================================================
// 🚀 ENGINE - MULTI-CATEGORY & FILTER LOGIC
// =========================================================================
let filtroAtual = "ALL";
const LIMITE_CATEGORIAS_VISIVEIS = 5;

function gerarBotoesDeFiltro() {
    const mainFiltersContainer = document.getElementById("main-filters");
    const extraFiltersContainer = document.getElementById("extra-filters");
    
    if (!mainFiltersContainer) return;

    mainFiltersContainer.innerHTML = "";
    extraFiltersContainer.innerHTML = "";

    let todasCategorias = [];
    bibliotecaMeshes.forEach(item => {
        if (Array.isArray(item.categoria)) {
            item.categoria.forEach(cat => todasCategorias.push(cat.toUpperCase()));
        } else {
            todasCategorias.push(item.categoria.toUpperCase());
        }
    });

    const categoriasUnicas = ["ALL", ...new Set(todasCategorias)];

    const visiveis = categoriasUnicas.slice(0, LIMITE_CATEGORIAS_VISIVEIS);
    const extras = categoriasUnicas.slice(LIMITE_CATEGORIAS_VISIVEIS);

    visiveis.forEach(cat => {
        mainFiltersContainer.appendChild(criarBotaoFiltro(cat));
    });

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

        extras.forEach(cat => {
            extraFiltersContainer.appendChild(criarBotaoFiltro(cat));
        });
    }
}

function criarBotaoFiltro(categoriaNome) {
    const btn = document.createElement("button");
    btn.className = `filter-btn ${filtroAtual === categoriaNome ? 'active' : ''}`;
    btn.innerText = categoriaNome.charAt(0) + categoriaNome.slice(1).toLowerCase();
    btn.setAttribute("data-filter", categoriaNome);

    btn.addEventListener("click", () => {
        filtroAtual = categoriaNome;
        
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
        if (filtroAtual === "ALL") return true;
        
        if (Array.isArray(item.categoria)) {
            return item.categoria.some(cat => cat.toUpperCase() === filtroAtual);
        }
        return item.categoria.toUpperCase() === filtroAtual;
    });

    if (itensFiltrados.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--texto-secundario); padding: 40px 0;">No items found in this category.</p>`;
        return;
    }

    itensFiltrados.forEach(item => {
        const card = document.createElement("div");
        card.className = "card-mesh";
        const imagemCapa = item.imagens[0] || "";

        const categoriasTexto = Array.isArray(item.categoria) ? item.categoria.join(" / ") : item.categoria;

        card.innerHTML = `
            <div class="img-container" onclick="window.location.href='produto.html?id=${item.id}'">
                <span class="badge-categoria">${escapeHTML(categoriasTexto)}</span>
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
// 📖 IMAGE SLIDER LOGIC (Corrigida e com Animações)
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

    // Carrega TODAS as imagens do array do produto corretamente
    fotosDoProduto = produto.imagens;
    slideIndex = 0;
    
    const mostrarSetas = fotosDoProduto.length > 1 ? 'flex' : 'none';
    const categoriasTexto = Array.isArray(produto.categoria) ? produto.categoria.join(" / ") : produto.categoria;

    container.innerHTML = `
        <a href="index.html" class="btn-back">← Back to Gallery</a>
        <div class="produto-wrapper">
            <div class="produto-media">
                <div class="slider-container">
                    <img id="slider-img" src="${escapeHTML(fotosDoProduto[0])}" alt="${escapeHTML(produto.nome)}">
                    <button class="slide-nav prev" style="display: ${mostrarSetas}" onclick="mudarSlide(-1)">&#10094;</button>
                    <button class="slide-nav next" style="display: ${mostrarSetas}" onclick="mazerSlide(1)">&#10095;</button>
                </div>
            </div>
            <div class="produto-info">
                <span class="badge-categoria">${escapeHTML(categoriasTexto)}</span>
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
                <a href="${escapeHTML(produto.linkDownload)}" class="btn-download" target="_blank">
                    ⬇️ Download Complete File
                </a>
            </div>
        </div>
    `;
}

// Vincula a função ao escopo global garantindo o funcionamento do clique
window.mudarSlide = function(direcao) {
    if (fotosDoProduto.length <= 1) return;

    slideIndex += direcao;
    if (slideIndex >= fotosDoProduto.length) slideIndex = 0;
    if (slideIndex < 0) slideIndex = fotosDoProduto.length - 1;
    
    const imagemElemento = document.getElementById("slider-img");
    if (imagemElemento) {
        // Remove a animação antiga para poder resetar o ciclo
        imagemElemento.classList.remove("fade-anim");
        
        // Força o navegador a recalcular o elemento antes de adicionar a animação de novo
        void imagemElemento.offsetWidth; 
        
        // Altera a imagem e injeta o efeito de transição suave
        imagemElemento.src = fotosDoProduto[slideIndex];
        imagemElemento.classList.add("fade-anim");
    }
}

// Atalho alternativo mapeado para evitar conflitos de nomenclatura nas setas HTML
window.mazerSlide = window.mudarSlide;

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
