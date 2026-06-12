// =========================================================================
// 📁 MOTOR DO SITE - A LISTA COMEÇA VAZIA E OS OUTROS ARQUIVOS ENCHEM ELA
// =========================================================================
const bibliotecaMeshes = []; 

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

// Função auxiliar para verificar se o arquivo é um vídeo
function verificarSeEhVideo(url) {
    const urlLower = url.toLowerCase();
    return urlLower.endsWith('.mp4') || urlLower.endsWith('.webm');
}

// Retorna a tag correta (video ou img) baseada no link do arquivo
function gerarTagMidia(url, idAtributo = "") {
    const idStr = idAtributo ? `id="${idAtributo}"` : "";
    if (verificarSeEhVideo(url)) {
        return `<video ${idStr} src="${escapeHTML(url)}" autoplay loop muted playsinline></video>`;
    } else {
        return `<img ${idStr} src="${escapeHTML(url)}" alt="Asset Media">`;
    }
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
        const midiaCapaUrl = item.imagens[0] || "";
        
        // Gera dinamicamente se o card principal vai ter uma tag <video> ou <img>
        const tagMidiaCapa = gerarTagMidia(midiaCapaUrl);

        const categoriasTexto = Array.isArray(item.categoria) ? item.categoria.join(" / ") : item.categoria;

        card.innerHTML = `
            <div class="img-container" onclick="window.location.href='produto.html?id=${item.id}'">
                <span class="badge-categoria">${escapeHTML(categoriasTexto)}</span>
                ${tagMidiaCapa}
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
                <a href="${escapeHTML(item.linkDownload)}" class="btn-shortcut-download" target="_blank">
                    ⬇️ Download Now
                </a>
            </div>
        `;
        container.appendChild(card);
    });
}

// =========================================================================
// 📖 IMAGE/VIDEO SLIDER LOGIC
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
    const categoriasTexto = Array.isArray(produto.categoria) ? produto.categoria.join(" / ") : produto.categoria;

    // Gera a primeira mídia do slider interno (pode ser vídeo ou imagem)
    const tagMidiaSlider = gerarTagMidia(fotosDoProduto[0], "slider-img");

    container.innerHTML = `
        <a href="index.html" class="btn-back">← Back to Gallery</a>
        <div class="produto-wrapper">
            <div class="produto-media">
                <div class="slider-container" id="slider-media-box">
                    ${tagMidiaSlider}
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

window.mudarSlide = function(direcao) {
    if (fotosDoProduto.length <= 1) return;

    slideIndex += direcao;
    if (slideIndex >= fotosDoProduto.length) slideIndex = 0;
    if (slideIndex < 0) slideIndex = fotosDoProduto.length - 1;
    
    const sliderBox = document.getElementById("slider-media-box");
    if (sliderBox) {
        // Remove os botões temporariamente para reconstruir a tag de mídia sem deletá-los
        const prevBtn = sliderBox.querySelector(".slide-nav.prev");
        const nextBtn = sliderBox.querySelector(".slide-nav.next");
        
        // Reconstrói o conteúdo interno baseado se o próximo slide é vídeo ou imagem
        const novaMidiaUrl = fotosDoProduto[slideIndex];
        const novaTag = gerarTagMidia(novaMidiaUrl, "slider-img");
        
        sliderBox.innerHTML = novaTag;
        
        // Readiciona os botões de navegação
        if (prevBtn) sliderBox.appendChild(prevBtn);
        if (nextBtn) sliderBox.appendChild(nextBtn);

        // Aplica a animação de Fade no novo elemento criado
        const elementoCriado = document.getElementById("slider-img");
        if (elementoCriado) {
            elementoCriado.classList.add("fade-anim");
        }
    }
}

window.mazerSlide = window.mudarSlide;

function escapeHTML(string) {
    return String(string).replace(/[&<>"']/g, function (s) {
        return { '&': '&amp;', '<': '&lt;', '>': '>‘', '"': '&quot;', "'": '&#39;' }[s];
    });
}

// Inicializa o sistema após carregar todos os dados dependentes externos
window.addEventListener("load", () => {
    if (document.getElementById("filter-container")) {
        gerarBotoesDeFiltro();
        renderizarBiblioteca();
    }
    if (document.getElementById("detalhe-produto")) {
        carregarPaginaProduto();
    }
});
