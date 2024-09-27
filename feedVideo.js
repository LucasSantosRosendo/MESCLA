/************************************************************************************/
// Inicialização do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getDatabase, ref as databaseRef, get } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';

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
const auth = getAuth(app);

/************************************************************************************/

document.addEventListener('DOMContentLoaded', function() {
    // Verifica o estado de autenticação e busca a cidade do usuário logado
    onAuthStateChanged(auth, (user) => {
        if (user) {
            const userId = user.uid;


            // Busca a cidade do usuário logado no Realtime Database
            const userCityRef = databaseRef(database, `users/${userId}/cidade`);
            get(userCityRef).then((snapshot) => {
                const userCity = snapshot.val();

                if (userCity) {
                    getDescription(userCity);  // Chama a função com a cidade do usuário
                } else {
                    console.error('Cidade do usuário não encontrada.');
                }
            }).catch((error) => {
                console.error("Erro ao obter a cidade do usuário: ", error);
            });
        } else {
            console.log("Nenhum usuário logado.");
        }
    });
});

let post = null;

function getDescription(userCity) {
    const publicacoesRef = databaseRef(database, 'videos'); // Referência à pasta "description"
    
    get(publicacoesRef)
      .then((snapshot) => {
        post = snapshot.val();
        
        if (post) {
            // Filtra as publicações para exibir apenas da mesma cidade do usuário
            const filteredPosts = Object.keys(post)
                .filter(key => post[key].city === userCity)  // Filtra pela cidade
                .reduce((obj, key) => {
                    obj[key] = post[key];
                    return obj;
                }, {});
            
            publish(filteredPosts);  // Somente exibe as publicações filtradas
        } else {
          console.error("Nenhum dado encontrado no banco de dados.");
        }
      })
      .catch((error) => {
        console.error("Erro ao ler dados: ", error);
      });
}

function publish(filteredPosts) {
    const publicacoesDiv = document.getElementById('publicacoes'); // O contêiner para as publicações

    // Certifique-se de que o contêiner existe
    if (!publicacoesDiv) {
        console.error('Elemento com ID "publicacoes" não encontrado.');
        return;
    }

    publicacoesDiv.innerHTML = ''; // Limpa a área de exibição

    // Transformar o objeto filtrado em um array
    const postsArray = Object.keys(filteredPosts).map(key => ({
        key: key,
        ...filteredPosts[key]
    }));

    // Ordenar os posts por posição (supondo que você tenha um campo 'position')
    postsArray.sort((a, b) => b.position - a.position);

    for (const postItem of postsArray) {
        const URL = postItem.videoUrl;
        const notice = postItem.description;
        const cidade = postItem.city;
        const name = postItem.user; 

        console.log(URL);
        console.log(notice);
        console.log(cidade);
        console.log(name);

        // Criar um novo elemento de vídeo
        const video = document.createElement('video');
        video.src = URL; //adiciona url para aparecer imagem
        video.alt = 'video da publicação';
        video.width = 300;  // Largura em pixels
        video.height = 200; // Altura em pixels
        video.controls = true; //Adiciona controles de reprodução (play, pause, volume)
        video.autoplay = true; // Reproduz o vídeo automaticamente

        //Cria um novo elemento para exibir nome
        const usuario = document.createElement('p');
        usuario.textContent = name;

        // Cria um novo elemento de parágrafo para o texto
        const descricao = document.createElement('p');
        descricao.textContent = notice;

        // Cria um contêiner para a publicação
        const container = document.createElement('div');
        container.classList.add('publicacaoVideo');

        // Adicionar a imagem e o texto ao contêiner
        container.appendChild(video);
        container.appendChild(descricao);
        container.appendChild(usuario);

        // Adicionar o contêiner ao div de publicações
        publicacoesDiv.appendChild(container);
    }
}
