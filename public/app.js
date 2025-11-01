// A variável 'destinos' agora será carregada do servidor.

/**
 * 1. Função para carregar os dados de destinos do JSON Server.
 * @returns {Array} Retorna a lista de destinos.
 */
async function fetchDestinos() {
    // URL base do JSON Server para a entidade 'destinos'
    const URL_API = 'http://localhost:3000/destinos';
    
    try {
        // Realiza a requisição GET
        const response = await fetch(URL_API);
        
        // Verifica se a requisição foi bem-sucedida (Status 200)
        if (!response.ok) {
            // Lança um erro se o status for 4xx ou 5xx
            throw new Error(`Erro ao carregar dados. Status: ${response.status}`);
        }
        
        // Retorna os dados em formato JSON
        return await response.json();
        
    } catch (error) {
        console.error("Erro ao conectar ou buscar dados do servidor:", error);
        // Retorna um array vazio para não quebrar a aplicação em caso de falha.
        return []; 
    }
}

/**
 * 2. Função principal para montar e renderizar os cards.
 * Agora, ela precisa ser assíncrona para esperar o fetchDestinos().
 */
async function montarCards() {
    const container = document.getElementById("cards-container");
    
    // Obtém os dados de forma dinâmica, esperando a promessa de fetchDestinos
    const destinos = await fetchDestinos(); 

    if (destinos.length === 0) {
        container.innerHTML = "<p>Nenhum destino encontrado ou falha na conexão.</p>";
        return;
    }

    // Limpa o conteúdo (caso necessário) e itera sobre os dados
    destinos.forEach(destino => {
        const card = document.createElement("div");
        card.classList.add("card");

        // Conteúdo visual do card (igual ao seu original)
        card.innerHTML = `
            <img src="${destino.imagem}" alt="${destino.nome}">
            <h2>${destino.nome}</h2>
            <p>${destino.pais}</p>
            <p>${destino.descricao}</p>
        `;

        // Evento de clique para redirecionar para a página de detalhes
        // NOTA: Para um CRUD completo, o link deveria usar o ID:
        // window.location.href = `detalhes.html?id=${destino.id}`;
        card.addEventListener("click", () => {
             // Mantendo o seu código original por enquanto:
             window.location.href = destino.link;
        });

        container.appendChild(card);
    });
}

// Garante que a função montarCards seja chamada após o carregamento do DOM
document.addEventListener("DOMContentLoaded", montarCards);