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
                    // Busca e exibe tanto vídeos quanto imagens da cidade do usuário
                    getPosts(userCity);
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

let posts = []; //dexou de ser uma variavel vazia e virou um vetor

// Função para buscar vídeos e imagens
function getPosts(userCity) {
    const videosRef = databaseRef(database, 'videos');
    const imagesRef = databaseRef(database, 'description');

    // Busca vídeos
    get(videosRef).then((snapshot) => {
        const videoPosts = snapshot.val() || {};
        const filteredVideos = Object.keys(videoPosts)
            .filter(key => videoPosts[key].city === userCity)
            .reduce((obj, key) => {
                obj[key] = { ...videoPosts[key], type: 'video' };
                return obj;
            }, {});
        // Adiciona os vídeos à lista de posts
        posts = posts.concat(Object.values(filteredVideos));

        // Após buscar vídeos, busca imagens
        get(imagesRef).then((snapshot) => {
            const imagePosts = snapshot.val() || {};
            const filteredImages = Object.keys(imagePosts)
                .filter(key => imagePosts[key].city === userCity)
                .reduce((obj, key) => {
                    obj[key] = { ...imagePosts[key], type: 'image' };
                    return obj;
                }, {});

            // Adiciona as imagens à lista de posts
            posts = posts.concat(Object.values(filteredImages));

            // Ordena as publicações (se necessário) e publica no feed
            publish(posts);
        }).catch((error) => {
            console.error("Erro ao obter imagens: ", error);
        });

    }).catch((error) => {
        console.error("Erro ao obter vídeos: ", error);
    });
}

// Função para exibir os posts no feed
function publish(posts) {
    const publicacoesDiv = document.getElementById('publicacoes'); // O contêiner para as publicações

    // Certifique-se de que o contêiner existe
    if (!publicacoesDiv) {
        console.error('Elemento com ID "publicacoes" não encontrado.');
        return;
    }

    publicacoesDiv.innerHTML = ''; // Limpa a área de exibição

    // Ordenar os posts por posição (ou qualquer outro critério)
    posts.sort((a, b) => b.position - a.position);

    // Exibe cada post, seja imagem ou vídeo
    for (const postItem of posts) {
        const URL = postItem.type === 'video' ? postItem.videoUrl : postItem.imageUrl; //encadeamento opicional
        const notice = postItem.type === 'video' ? postItem.description : postItem.text;
        const cidade = postItem.city;
        const name = postItem.user;

        console.log(URL);
        console.log(notice);
        console.log(cidade);
        console.log(name);

        // Cria o contêiner da publicação
        const container = document.createElement('div');
        container.classList.add('publicacao');

        // Cria o elemento apropriado (imagem ou vídeo)
        if (postItem.type === 'video') {
            const video = document.createElement('video');
            video.src = URL;
            video.alt = 'Vídeo da publicação';
            video.width = 300;
            video.height = 200;
            video.controls = true;
            container.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = URL;
            img.alt = 'Imagem da publicação';
            img.width = 300;
            img.height = 200;
            container.appendChild(img);
        }

        // Cria os elementos de descrição e nome do usuário
        const descricao = document.createElement('p');
        descricao.textContent = notice;
        const usuario = document.createElement('p');
        usuario.textContent = name;

        // Adiciona os elementos ao contêiner da publicação
        container.appendChild(descricao);
        container.appendChild(usuario);

        // Adiciona o contêiner ao div de publicações
        publicacoesDiv.appendChild(container);
    }
}
