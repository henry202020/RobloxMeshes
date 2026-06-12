// =========================================================================
// 📁 ÁREA DE EDITAR / CRIAR SEUS ITENS
// =========================================================================
const bibliotecaMeshes = [
    {
        id: 0,
        nome: "Espada Cyberpunk V1",
        categoria: "MESHES",
        descricao: "Uma espada neon ultra detalhada ideal para jogos de RPG.",
        descricaoLonga: "Esta espada foi desenvolvida pensando na otimização para jogos mobile e PC no Roblox. Ela conta com malha totalmente limpa, mapeamento UV completo e texturas de emissão de luz (neon) inclusas no pacote. Perfeita para ferramentas de combate ou itens cosméticos de costas.",
        imagem: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500",
        linkDownload: "downloads/espada_cyber.zip",
        formato: ".FBX",
        tamanho: "1.2 MB"
    },
    {
        id: 1,
        nome: "Tronco Robótico Sci-Fi",
        categoria: "TORSOS",
        descricao: "Modelo de Torso mecânico estilizado para personagens cibernéticos.",
        descricaoLonga: "Um torso completo pronto para substituição de pacotes de corpo (R15) no Roblox Studio. Linhas minimalistas e encaixe perfeito com as animações padrões do motor do jogo. Não causa bugs de colisão.",
        imagem: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=500",
        linkDownload: "downloads/cyber_torso.zip",
        formato: ".OBJ",
        tamanho: "2.5 MB"
    }
];

// =========================================================================
// 🚀 LÓGICA DO SISTEMA (Index e Filtros)
// =========================================================================
let filtroAtual = "ALL";

function renderizarBiblioteca() {
    const container = document.getElementById("lista-de-meshes");
    if (!container) return; // Se não estiver na index, não executa

    container.innerHTML = "";

    const itensFiltrados = bibliotecaMeshes.filter(item => {
        return filtroAtual === "ALL" || item.categoria.toUpperCase() === filtroAtual;
    });

    if (itensFiltrados.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--texto-secundario); padding: 40px 0;">Nenhum item encontrado nesta categoria.</p>`;
        return;
    }

    itensFiltrados.forEach(item => {
        const card = document.createElement("div");
        card.className = "card-mesh";
        // O clique no card agora abre a página do produto passando o ID por link
        card.onclick = () => window.location.href = `produto.html?id=${item.id}`;

        card.innerHTML = `
            <div class="img-container">
                <span class="badge-categoria">${escapeHTML(item.categoria)}</span>
                <img src="${escapeHTML(item.imagem)}" alt="${escapeHTML(item.nome)}">
            </div>
            <div class="card-content">
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
                <span class="btn-ver-mais">Visualizar Detalhes ➔</span>
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
// 📖 LÓGICA DA PÁGINA DE DETALHES (produto.html)
// =========================================================================
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

    // Injeta os dados detalhados na página interna
    container.innerHTML = `
        <a href="index.html" class="btn-back">← Voltar para a Galeria</a>
        <div class="produto-wrapper">
            <div class="produto-media">
                <img src="${escapeHTML(produto.imagem)}" alt="${escapeHTML(produto.nome)}">
            </div>
            <div class="produto-info">
                <span class="badge-categoria">${escapeHTML(produto.categoria)}</span>
                <h1>${escapeHTML(produto.nome)}</h1>
                <p class="descricao-longa">${escapeHTML(produto.descricaoLonga)}</p>
                
                <div class="detalhes-tecnicos">
                    <div class="detalhes-linha">
                        <span class="detalhes-label">Formato do Arquivo:</span>
                        <span class="detalhes-valor">${escapeHTML(produto.formato)}</span>
                    </div>
                    <div class="detalhes-linha">
                        <span class="detalhes-label">Espaço em Disco:</span>
                        <span class="detalhes-valor">${escapeHTML(produto.tamanho)}</span>
                    </div>
                </div>

                <a href="${escapeHTML(produto.linkDownload)}" class="btn-download" download>
                    ⬇️ Baixar Arquivo Completo
                </a>
            </div>
        </div>
    `;
}

function escapeHTML(string) {
    return String(string).replace(/[&<>"']/g, function (s) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s];
    });
}

// Inicialização inteligente dependendo de qual página está aberta
window.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("lista-de-meshes")) {
        inicializarFiltros();
        renderizarBiblioteca();
    }
    if (document.getElementById("detalhe-produto")) {
        carregarPaginaProduto();
    }
});
