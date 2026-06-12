// 🛠️ SUA BIBLIOTECA DE ITENS
// Para adicionar um novo item, copie de um "{" até o "}," e mude os dados.
const bibliotecaMeshes = [
    {
        nome: "Espada Cyberpunk V1",
        categoria: "Armas",
        descricao: "Uma espada neon ultra detalhada ideal para jogos de RPG ou mapas futuristas.",
        imagem: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500",
        linkDownload: "downloads/espada_cyber.zip",
        formato: ".FBX / .OBJ",
        poligonos: "2.450",
        tamanho: "1.2 MB"
    },
    {
        nome: "Árvore Low-Poly Anime",
        categoria: "Cenário",
        descricao: "Árvore estilizada perfeita para mapas de simuladores e jogos de aventura.",
        imagem: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=500",
        linkDownload: "downloads/arvore_anime.zip",
        formato: ".FBX",
        poligonos: "480",
        tamanho: "340 KB"
    }
];

// FUNÇÃO QUE GERA O VISUAL (Segura, impede injeção de códigos maliciosos)
function carregarBiblioteca() {
    const container = document.getElementById("lista-de-meshes");
    if (!container) return;
    
    container.innerHTML = ""; 

    bibliotecaMeshes.forEach(item => {
        const card = document.createElement("div");
        card.className = "card-mesh";

        // Criação dos elementos de forma limpa e segura
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
                    ⬇️ Baixar Mesh
                </a>
            </div>
        `;
        container.appendChild(card);
    });
}

// Função de segurança extra para evitar que textos virem códigos maliciosos (XSS)
function escapeHTML(string) {
    return String(string).replace(/[&<>"']/g, function (s) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s];
    });
}

window.onload = carregarBiblioteca;
