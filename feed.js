/************************************************************************************/
// Inicialização do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getDatabase, ref as databaseRef, get } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';

const firebaseConfig = {
  apiKey: "AIzaSyCBzItoPtnnZL3qZzaugxDwnzja2g_ddas",
  authDomain: "mescla-f9d00.firebaseapp.com",
  databaseURL: "https://mescla-f9d00-default-rtdb.firebaseio.com",
  projectId: "mescla-f9d00",
  storageBucket: "mescla-f9d00.appspot.com",
  messagingSenderId: "442057041731",
  appId: "1:442057041731:web:a5d7208555136ba97531f6"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

/************************************************************************************/

document.addEventListener('DOMContentLoaded', function() {
    getDescription();  // Chama a função apenas quando o DOM estiver pronto
});

let post = null;

function getDescription() {
    const publicacoesRef = databaseRef(database, 'description'); // Referência correta à pasta "description"
    get(publicacoesRef)
      .then((snapshot) => {
        post = snapshot.val();
        
        console.log("Dados retornados do Realtime Database:", post); // Verifique os dados retornados
        
        if (post) {
            publish(post); // Somente chamar se houver dados
        } else {
          console.error("Nenhum dado encontrado no banco de dados.");
        }
      })
      .catch((error) => {
        console.error("Erro ao ler dados: ", error);
      });
}

function publish(post) {
    const publicacoesDiv = document.getElementById('publicacoes'); // O contêiner para as publicações

    // Certifique-se de que o contêiner existe
    if (!publicacoesDiv) {
        console.error('Elemento com ID "publicacoes" não encontrado.');
        return;
    }

    publicacoesDiv.innerHTML = ''; // Limpa a área de exibição

    // Transformar o objeto em um array
    const postsArray = Object.keys(post).map(key => ({
        key: key,
        ...post[key]
    }));

    // Ordenar os posts por posição (supondo que você tenha um campo 'position')
    postsArray.sort((a, b) => a.position - b.position); // Ordem crescente

    for (const postItem of postsArray) {
        const URL = postItem.imageUrl;
        const notice = postItem.text;

        console.log(URL);
        console.log(notice);

        // Criar um novo elemento de imagem
        const img = document.createElement('img');
        img.src = URL;
        img.alt = 'Imagem da publicação';
        img.width = 300;  // Largura em pixels
        img.height = 200; // Altura em pixels

        // Criar um novo elemento de parágrafo para o texto
        const descricao = document.createElement('p');
        descricao.textContent = notice;

        // Criar um contêiner para a publicação
        const container = document.createElement('div');
        container.classList.add('publicacao');

        // Adicionar a imagem e o texto ao contêiner
        container.appendChild(img);
        container.appendChild(descricao);

        // Adicionar o contêiner ao div de publicações
        publicacoesDiv.appendChild(container);
    }
}
