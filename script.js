// =========================================================================
// 📁 ÁREA DE EDITAR / CRIAR SEUS ITENS da Biblioteca
// IMPORTANTE: Em 'categoria' coloque apenas: MESHES, TORSOS, ARMS, LEGS, HEAD, MAPS ou OTHERS
// =========================================================================
const bibliotecaMeshes = [
    {
        nome: "Espada Cyberpunk V1",
        categoria: "MESHES", // Filtro selecionado
        descricao: "Uma espada neon ultra detalhada ideal para jogos de RPG ou mapas futuristas.",
        imagem: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500",
        linkDownload: "downloads/espada_cyber.zip",
        formato: ".FBX",
        poligonos: "2.450",
        tamanho: "1.2 MB"
    },
    {
        nome: "Tronco Robótico Sci-Fi",
        categoria: "TORSOS", // Filtro selecionado
        descricao: "Modelo de Torso mecânico estilizado para personagens cibernéticos customizados.",
        imagem: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=500",
        linkDownload: "downloads/cyber_torso.zip",
        formato: ".OBJ",
        poligonos: "4.120",
        tamanho: "2.5 MB"
    },
    {
        nome: "Braço de Androide Esquerdo",
        categoria: "ARMS", // Filtro selecionado
        descricao: "Braço robótico detalhado com juntas articuladas pronto para rigging no Studio.",
        imagem: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500",
        linkDownload: "downloads/cyber_arm.zip",
        formato: ".FBX",
        poligonos: "1.800",
        tamanho: "980 KB"
    },
    // ⬇️ Adicione seus novos itens aqui embaixo seguindo o mesmo padrão:
];

// =========================================================================
// 🚀 LÓGICA DO SISTEMA (Filtragem e Segurança automática)
// =========================================================================

let filtroAtual = "ALL";

// Função para desenhar os cards baseando-se no filtro ativo
function renderizarBiblioteca() {
    const container = document.getElementById("lista-de-meshes");
    if (!container) return;

    container.innerHTML = ""; // Limpa a tela

    // Filtra os itens com base na escolha do usuário
    const itensFiltrados = bibliotecaMeshes.filter(item => {
        return filtroAtual === "ALL" || item.categoria.toUpperCase() === filtroAtual;
    });

    // Se não tiver nada na categoria selecionada
    if (itensFiltrados.length === 0) {
        container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--texto-secundario); padding: 40px 0;">Nenhum item encontrado nesta categoria.</p>`;
        return;
    }

    // Cria os cards na tela de forma segura
    itensFiltrados.forEach(item => {
        const card = document.createElement("div");
        card.className = "card-mesh";

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
                        <span class="detalhes-label">Polígonos:</span>
                        <span class="detalhes-valor">${escapeHTML(item.poligonos)}</span>
                    </div>
                    <div class="detalhes-linha">
                        <span class="detalhes-label">Tamanho:</span>
                        <span class="detalhes-valor">${escapeHTML(item.tamanho)}</span>
                    </div>
                </div>

                <a href="${escapeHTML(item.linkDownload)}" class="btn-download" download>
                    ⬇️ Baixar Asset
                </a>
            </div>
        `;
        container.appendChild(card);
    });
}

// Configura a ação de clique nos botões de filtro
function inicializarFiltros() {
    const botoes = document.querySelectorAll(".filter-btn");

    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            // Remove a classe ativa de todos e coloca no botão clicado
            botoes.forEach(b => b.classList.remove("active"));
            botao.classList.add("active");

            // Atualiza o filtro e recarrega a lista
            filtroAtual = botao.getAttribute("data-filter").toUpperCase();
            renderizarBiblioteca();
        });
    });
}

// Escapar caracteres para segurança extra (Anti-XSS)
function escapeHTML(string) {
    return String(string).replace(/[&<>"']/g, function (s) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s];
    });
}

// Inicia tudo assim que a página abrir
window.addEventListener("DOMContentLoaded", () => {
    inicializarFiltros();
    renderizarBiblioteca();
});
