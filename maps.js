import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';
import { getDatabase, ref as databaseRef, get } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js"; // Importa o método 'get'
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCBzItoPtnnZL3qZzaugxDwnzja2g_ddas",
  authDomain: "mescla-f9d00.firebaseapp.com",
  databaseURL: "https://mescla-f9d00-default-rtdb.firebaseio.com",
  projectId: "mescla-f9d00",
  storageBucket: "mescla-f9d00.appspot.com",
  messagingSenderId: "442057041731",
  appId: "1:442057041731:web:a5d7208555136ba97531f6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);
const auth = getAuth(app);

let latitude = null;
let longitude = null;
let posts = [];


document.addEventListener("DOMContentLoaded", function () {
  obterCoordenadas();
  // Verifica o estado de autenticação e busca a cidade do usuário logado
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const userId = user.uid;

      // Busca a cidade do usuário logado no Realtime Database
      const userCityRef = databaseRef(database, `users/${userId}/cidade`);
      get(userCityRef)
        .then((snapshot) => {
          const userCity = snapshot.val();

          if (userCity) {
            // Busca e exibe tanto vídeos quanto imagens da cidade do usuário
            getPosts(userCity);
          } else {
            console.error("Cidade do usuário não encontrada.");
          }
        })
        .catch((error) => {
          console.error("Erro ao obter a cidade do usuário: ", error);
        });
    } else {
      console.log("Nenhum usuário logado.");
    }
  });
});

// Função para buscar vídeos e imagens
function getPosts(userCity) {
  const videosRef = databaseRef(database, "videos");
  const imagesRef = databaseRef(database, "description");

  // Busca vídeos
  get(videosRef)
    .then((snapshot) => {
      const videoPosts = snapshot.val() || {};
      const filteredVideos = Object.keys(videoPosts)
        .filter((key) => videoPosts[key].city === userCity)
        .reduce((obj, key) => {
          obj[key] = { ...videoPosts[key], type: "video" };
          return obj;
        }, {});
      // Adiciona os vídeos à lista de posts
      posts = posts.concat(Object.values(filteredVideos));

      // Após buscar vídeos, busca imagens
      get(imagesRef)
        .then((snapshot) => {
          const imagePosts = snapshot.val() || {};
          const filteredImages = Object.keys(imagePosts)
            .filter((key) => imagePosts[key].city === userCity)
            .reduce((obj, key) => {
              obj[key] = { ...imagePosts[key], type: "image" };
              return obj;
            }, {});

          // Adiciona as imagens à lista de posts
          posts = posts.concat(Object.values(filteredImages));

          // Ordena as publicações (se necessário) e publica no feed
          publish(posts);
        })
        .catch((error) => {
          console.error("Erro ao obter imagens: ", error);
        });
    })
    .catch((error) => {
      console.error("Erro ao obter vídeos: ", error);
    });
}
// Função para obter a localização do usuário
function obterCoordenadas() {
  // Verifica se a geolocalização é suportada
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    console.log("Geolocalização não é suportada neste navegador.");
  }
}

// Função que exibe as coordenadas e as salva no localStorage
function showPosition(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

  // Armazena as coordenadas no localStorage
  localStorage.setItem('latitude', latitude);
  localStorage.setItem('longitude', longitude);
}

// Função para lidar com erros
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log("Usuário negou a solicitação de Geolocalização.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Informações de localização não estão disponíveis.");
      break;
    case error.TIMEOUT:
      console.log("A solicitação de localização expirou.");
      break;
    case error.UNKNOWN_ERROR:
      console.log("Um erro desconhecido ocorreu.");
      break;
  }
}
document.getElementById('openMapBtn').addEventListener('click', function () {
  const mapDiv = document.getElementById('map');
  mapDiv.style.display = 'block';  // Mostra o mapa

  let map;
  let lat = parseFloat(localStorage.getItem('latitude'));
  let lng = parseFloat(localStorage.getItem('longitude'));

  // Função para imprimir todos os marcadores armazenados
  function printMarkers(markersDictionary) {
    console.log("Marcadores armazenados:");

    // Itera sobre as entradas do objeto markersDictionary
    for (const [key, info] of Object.entries(markersDictionary)) {
      console.log(`Marcador ${key}:`);
      console.log(`Latitude: ${info.lat}, Longitude: ${info.lng}`);
      console.log(`Descrição: ${info.descricao || "Sem descrição"}`);
      console.log(`URL da Imagem: ${info.urlImagem || "Sem imagem"}`);
      console.log(`URL do Vídeo: ${info.urlVideo || "Sem vídeo"}`);

    }
  }

  // Função para inicializar o mapa
  async function initMap(publicacoesDiv, urlImagem, urlVideo, descricaoMap, armazem) {
    let lat = parseFloat(localStorage.getItem('latitude'));
    let lng = parseFloat(localStorage.getItem('longitude'));


    let floatLat = parseFloat(localStorage.getItem('floatLat'));
    let floatLng = parseFloat(localStorage.getItem('floatLng'));




    console.log(`Latitude: ${lat}, Longitude: ${lng}`);
    console.log(publicacoesDiv);
    if (!isNaN(lat) && !isNaN(lng) && !isNaN(floatLat) && !isNaN(floatLng)) {

      let position = { lat: lat, lng: lng };

      // Carregar as bibliotecas necessárias do Google Maps
      const { Map, InfoWindow } = await google.maps.importLibrary("maps");
      const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker");

      // Inicializar o mapa, centralizado nas coordenadas especificadas
      const map = new Map(document.getElementById("map"), {
        zoom: 15,
        center: position,
        mapId: "DEMO_MAP_ID", // Substitua pelo seu ID de mapa
      });

      console.log("ARRAY no initMap: " + JSON.stringify(armazem));

      // Criar uma info window que será usada pelo marcador
      const infoWindow = new InfoWindow();

      // armazem sendo um array de objetos
      armazem.forEach((item) => {
        // Acessando propriedades de cada objeto no array
        const latitude = item.lat;
        const longitude = item.lng;
        const descricao = item.descricao;
        const urlImagem = item.urlImagem;
        const urlVideo = item.urlVideo;
        const usuario = item.usuario;

  // Criar o conteúdo do marcador (Pin personalizado)
  const pin = new PinElement({
    glyph: "@", // Defina um ícone ou número, como no exemplo fornecido
    scale: 1.5,
  });

    // Adicionar o marcador ao mapa
    const marker = new AdvancedMarkerElement({
      map: map,
      position: { lat: latitude, lng: longitude }, // Usa as coordenadas armazenadas
      title: "Publicação de: "+ usuario,
      content: pin.element, // Usa o pin como conteúdo visual do marcador
      gmpClickable: true, // Permitir cliques no marcador
    });

      // Adicionar um listener para clique no marcador e exibir a info window
  marker.content.addEventListener("click", () => {
    infoWindow.close(); // Fecha qualquer infoWindow aberta anteriormente
  // Verifica se é uma imagem ou um vídeo e monta o conteúdo
  let mediaContent;
  if (urlImagem) {
    mediaContent = `<img src="${urlImagem}" alt="Descrição da Imagem" style="width: 100%; height: auto;">`;
  } else if (urlVideo) {
    mediaContent = `<video controls style="width: 100%; height: auto;">
                      <source src="${urlVideo}" type="video/mp4">
                      Seu navegador não suporta vídeo.
                    </video>`;
  }

  // Configura o conteúdo da InfoWindow
  infoWindow.setContent(`
    <div>
      <strong>${descricao}</strong><br>
      <div>${mediaContent}</div>
    </div>
  `);

  infoWindow.open(map, marker); // Abre a infoWindow na posição do marcador
});
      });

    } else {
      console.error('Coordenadas inválidas:', floatLat, floatLng);
    }
  }

  // Mover a chamada de initMap para a função correta
  document.getElementById('openMapBtn').addEventListener('click', function () {
    const mapDiv = document.getElementById('map');
    mapDiv.style.display = 'block';  // Mostra o mapa

    obterCoordenadas();  // Obtém as coordenadas e armazena no localStorage
  });

  // Função para exibir os posts no feed
  function publish(posts) {
    let urlImagem = null;
    let urlVideo = null;
    let descricaoMap = null;
    const publicacoesDiv = document.getElementById("publicacoes");
    let armazem = [];
    let dici = {};

    if (!publicacoesDiv) {
      console.error('Elemento com ID "publicacoes" não encontrado.');
      return;
    }

    publicacoesDiv.innerHTML = "";  // Limpa a área de exibição
    posts.sort((a, b) => b.position - a.position);  // Ordena os posts

    for (const postItem of posts) {
      const URL = postItem.type === "video" ? postItem.videoUrl : postItem.imageUrl;
      const notice = postItem.type === "video" ? postItem.description : postItem.text;
      const cidade = postItem.city;
      const name = postItem.user;
      const latUser = postItem.latUser;
      const lngUser = postItem.lngUser;

      let lastLat = latUser;
      let lastLng = lngUser;
      let floatLat = parseFloat(lastLat);
      let floatLng = parseFloat(lastLng);


      localStorage.setItem('floatLat', floatLat);
      localStorage.setItem('floatLng', floatLng); // Corrigido de 'latLng' para 'lastLng'

      const container = document.createElement("div");
      container.classList.add("publicacao");

      const usuario = document.createElement("p");
      usuario.classList.add("nome-usuario");
      usuario.textContent = name;

      const descricao = document.createElement("p");
      descricao.classList.add("descricao-publicacao");
      descricao.textContent = notice;
      descricaoMap = descricao.textContent;

      if (postItem.type === "video") {
        const video = document.createElement("video");
        video.src = URL;
        video.alt = "Vídeo da publicação";
        video.width = 300;
        video.height = 200;
        video.controls = true;
        container.appendChild(video);
        urlVideo = video.src;

      } else {
        const img = document.createElement("img");
        img.src = URL;
        img.alt = "Imagem da publicação";
        img.width = 300;
        img.height = 200;
        container.appendChild(img);
        urlImagem = img.src;
      }

      container.appendChild(usuario);
      container.appendChild(descricao);
      publicacoesDiv.appendChild(container);

      const uni = `${Date.now()}-${Math.random()}`; // Combine com Math.random() para garantir unicidade

      // Armazenar o marcador e suas informações no dicionário
      dici[uni] = {
        lat: floatLat,
        lng: floatLng,
        descricao: descricaoMap,
        urlImagem: urlImagem,
        urlVideo: urlVideo,
        usuario: name,
      };

      armazem.push(dici[uni]); // Adiciona o objeto ao array

    }

    console.log(armazem);

    // Inicializa o mapa após a exibição dos posts
    initMap(publicacoesDiv, urlImagem, urlVideo, descricaoMap, armazem);
  }

  publish(posts);
});


// Função para exibir os posts no feed
function publish(posts) {

  const publicacoesDiv = document.getElementById("publicacoes"); // O contêiner para as publicações

  // Certifique-se de que o contêiner existe
  if (!publicacoesDiv) {
    console.error('Elemento com ID "publicacoes" não encontrado.');
    return;
  }

  publicacoesDiv.innerHTML = ""; // Limpa a área de exibição

  // Ordenar os posts por posição (ou qualquer outro critério)
  posts.sort((a, b) => b.position - a.position);

  // Exibe cada post, seja imagem ou vídeo
  for (const postItem of posts) {
    const URL =
      postItem.type === "video" ? postItem.videoUrl : postItem.imageUrl; // encadeamento opcional
    const notice =
      postItem.type === "video" ? postItem.description : postItem.text;
    const cidade = postItem.city;
    const name = postItem.user;

    console.log(URL);
    console.log(notice);
    console.log(cidade);
    console.log(name);

    // Cria o contêiner da publicação
    const container = document.createElement("div");
    container.classList.add("publicacao");

    // Cria os elementos de descrição e nome do usuário
    const usuario = document.createElement("p");
    usuario.classList.add("nome-usuario"); // Adiciona uma classe para o nome do usuário
    usuario.textContent = name;

    const descricao = document.createElement("p");
    descricao.classList.add("descricao-publicacao"); // Adiciona uma classe para a descrição
    descricao.textContent = notice;

    // Cria o elemento apropriado (imagem ou vídeo)
    if (postItem.type === "video") {
      const video = document.createElement("video");
      video.src = URL;
      video.alt = "Vídeo da publicação";
      video.width = 300;
      video.height = 200;
      video.controls = true;
      container.appendChild(video);
    } else {
      const img = document.createElement("img");
      img.src = URL;
      img.alt = "Imagem da publicação";
      img.width = 300;
      img.height = 200;
      container.appendChild(img);
    }

    // Adiciona os elementos ao contêiner da publicação
    container.appendChild(usuario);
    container.appendChild(descricao);

    // Adiciona o contêiner ao div de publicações
    publicacoesDiv.appendChild(container);
  }
}

