// Constante da API para facilitar a manutenção
const URL_API = 'http://localhost:3000/destinos';

// ----------------------------------------------------
// READ: Carrega e Renderiza (Função atualizada do GET)
// ----------------------------------------------------

async function fetchDestinos() {
    try {
        const response = await fetch(URL_API);
        if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        return [];
    }
}

async function montarCards() {
    const container = document.getElementById("cards-container");
    container.innerHTML = ''; // Limpa o container
    
    const destinos = await fetchDestinos(); 

    if (destinos.length === 0) {
        container.innerHTML = "<p>Nenhum destino encontrado ou falha na conexão.</p>";
        return;
    }

    destinos.forEach(destino => {
        const card = document.createElement("div");
        card.classList.add("card");

        // Adiciona botões de Ação para CRUD
        card.innerHTML = `
            <img src="${destino.imagem}" alt="${destino.nome}">
            <h2>${destino.nome}</h2>
            <p>${destino.pais}</p>
            <p>${destino.descricao}</p>
            <div class="card-actions">
                <button onclick="editDestino(${destino.id})">Editar</button>
                <button onclick="deleteDestino(${destino.id})">Excluir</button>
            </div>
        `;

        card.addEventListener("click", () => {
             // Redireciona para detalhes, passando o ID
             window.location.href = `detalhes.html?id=${destino.id}`; 
        });

        container.appendChild(card);
    });
}

// ----------------------------------------------------
// CREATE: Cadastra Novo Destino (POST)
// ----------------------------------------------------

async function createDestino(novoDestino) {
    try {
        const response = await fetch(URL_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoDestino)
        });

        if (response.status === 201) {
            alert(`Destino '${novoDestino.nome}' cadastrado com sucesso!`);
            montarCards(); // Recarrega a lista para mostrar o novo item
            return true;
        } else {
            throw new Error(`Falha ao cadastrar. Status: ${response.status}`);
        }
    } catch (error) {
        console.error("Erro POST:", error);
        alert('Erro ao cadastrar destino. Verifique o console.');
        return false;
    }
}

// Listener para o formulário de cadastro
document.addEventListener("DOMContentLoaded", () => {
    montarCards(); // Carrega os cards existentes

    const form = document.getElementById('form-cadastro-destino');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); 
            
            // Coleta dados do formulário
            const novoDestino = {
                nome: document.getElementById('nome').value,
                pais: document.getElementById('pais').value,
                descricao: document.getElementById('descricao').value,
                // Valores padrão para os campos não presentes no formulário simples
                imagem: "images/default.jpg", 
                link: "detalhes.html"
            };

            await createDestino(novoDestino);
            form.reset(); // Limpa o formulário após o sucesso
        });
    }
});


// ----------------------------------------------------
// DELETE: Excluir Destino
// ----------------------------------------------------

async function deleteDestino(id) {
    if (!confirm('Tem certeza que deseja excluir este destino?')) return;

    try {
        const response = await fetch(`${URL_API}/${id}`, {
            method: 'DELETE'
        });

        // JSON Server retorna 200 OK ou 204 No Content
        if (response.ok) { 
            alert('Destino excluído com sucesso!');
            montarCards(); // Recarrega a lista
        } else {
            throw new Error(`Falha ao excluir. Status: ${response.status}`);
        }
    } catch (error) {
        console.error("Erro DELETE:", error);
        alert('Erro ao excluir destino. Verifique o console.');
    }
}

// ----------------------------------------------------
// UPDATE: Editar Destino (PUT/PATCH) - Lógica de Exemplo
// ----------------------------------------------------
// NOTA: Esta lógica é mais complexa, pois geralmente abre um modal ou preenche um novo formulário.
// Aqui está um exemplo SIMPLES para fins de teste.

async function editDestino(id) {
    // 1. Encontrar o destino (opcional, mas bom para mostrar o dado atual)
    const currentName = prompt("Digite o novo nome para o destino (ID: " + id + "):");

    if (!currentName || currentName.trim() === "") {
        return; // Usuário cancelou ou não digitou nada
    }

    const updatedData = {
        nome: currentName // Apenas atualizando o nome
        // Em uma aplicação real, você enviaria todos os campos
    };
    
    try {
        const response = await fetch(`${URL_API}/${id}`, {
            method: 'PATCH', // PATCH é melhor para atualizar campos específicos
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            alert('Destino atualizado com sucesso!');
            montarCards(); // Recarrega a lista
        } else {
            throw new Error(`Falha ao atualizar. Status: ${response.status}`);
        }

    } catch (error) {
        console.error("Erro PUT/PATCH:", error);
        alert('Erro ao atualizar destino. Verifique o console.');
    }
}