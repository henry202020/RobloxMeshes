// =========================================================================
// 📁 EDIT / CREATE YOUR ITEMS HERE
// =========================================================================
const bibliotecaMeshes = [
    {
        id: 0,
        nome: "Cyberpunk Sword V1",
        categoria: "MESHES",
        descricao: "An ultra-detailed neon sword perfect for RPG games.",
        descricaoLonga: "This sword was developed with optimization in mind for mobile and PC games on Roblox. Full UV mapping and light emission (neon) textures are included in the package.",
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
        nome: "Sci-Fi Robotic Torso",
        categoria: "TORSOS",
        descricao: "Stylized mechanical torso model for custom cyber characters.",
        descricaoLonga: "A complete torso ready for character package replacement (R15) in Roblox Studio. Minimalist lines and seamless integration with default engine animations.",
        imagens: [
            "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=500"
        ],
        linkDownload: "downloads/cyber_torso.zip",
        formato: ".OBJ",
        tamanho: "2.5 MB"
    }
];

// =========================================================================
// 🚀 SYSTEM LOGIC
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
// 📖 IMAGE SLIDER LOGIC
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
    if (document.getElementById("lista-de-meshes")) {
        inicializarFiltros();
        renderizarBiblioteca();
    }
    if (document.getElementById("detalhe-produto")) {
        carregarPaginaProduto();
    }
});
