// Inicialização do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';
import { getDatabase, ref as databaseRef, push, set } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const database = getDatabase(app);
const auth = getAuth(app); // Obter referência ao Auth

/************************************************************************************/

// Variáveis globais para armazenar o arquivo selecionado e a descrição
let selectedFile = null;
let selectedTxt = null;
let URL = null;
let UserId = null;
let lat = null;
let lng = null;

// Verifica se o usuário está logado
onAuthStateChanged(auth, function (user) {
  if (user) {
    console.log("Usuário autenticado:", user.uid);
    UserId = user.uid;
  } else {
    window.location.href = "login.html";
  }
});

// Referências relacionadas à imagem
const inputFile = document.querySelector("#picture__input");
const pictureImage = document.querySelector(".picture__image");
const pictureImageTxt = "Clique aqui para escolher sua imagem";
pictureImage.innerHTML = pictureImageTxt;

console.log("Início popup");

document.addEventListener('DOMContentLoaded', function () {
  const botaoAdd = document.getElementById('addbutton');
  if (botaoAdd) {
    botaoAdd.addEventListener('click', function () {
      console.log("Botão de adicionar clicado."); // Adicionado para depuração
      obterCoordenadasUsuario(function (lat, lng) {
        console.log("Coordenadas obtidas:", lat, lng);
        // Chame aqui outras funções que precisam das coordenadas, se necessário
      });
    });
  }
});

inputFile.addEventListener("change", function (e) {
  const inputTarget = e.target;
  const file = inputTarget.files[0];

  if (file) {
    selectedFile = file;
    const reader = new FileReader();

    reader.addEventListener("load", function (e) {
      const readerTarget = e.target;

      const img = document.createElement("img");
      img.src = readerTarget.result;
      img.classList.add("picture__img");

      pictureImage.innerHTML = "";
      pictureImage.appendChild(img);
    });

    reader.readAsDataURL(file);
  } else {
    pictureImage.innerHTML = pictureImageTxt;
  }
});

/************************************************************************************/

function obterCoordenadasUsuario(callback) {
  console.log("Tentando obter coordenadas do usuário..."); // Adicionado para depuração
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      // Sucesso
      function (position) {
        lat = position.coords.latitude;
        lng = position.coords.longitude;

        console.log("Latitude do usuário: " + lat);
        console.log("Longitude do usuário: " + lng);

        // Chama o callback passando as coordenadas
        callback(lat, lng);
      },
      // Erro
      function (error) {
        console.error("Erro ao obter a localização: ", error);
        // Se ocorrer erro, você pode usar uma localização padrão (ex: Brasília)
        callback(-15.8267, -47.9218);
      }
    );
  } else {
    console.error("Geolocalização não é suportada pelo seu navegador.");
    alert("Geolocalização não é suportada pelo seu navegador.");
  }
}

// Função para upload de imagem
function uploadImage() {
  return new Promise((resolve, reject) => {
    const uniqueImageName = `images/${Date.now()}_${selectedFile.name}`;
    const imageRef = storageRef(storage, uniqueImageName);

    // Fazer o upload do arquivo
    uploadBytes(imageRef, selectedFile).then((snapshot) => {
      console.log('Upload de arquivo completo!');
      return getDownloadURL(imageRef); // Obter a URL de download
    }).then((url_imagem) => {
      console.log("URL da imagem:", url_imagem);
      resolve(url_imagem); // Retorna a URL da imagem após o upload
    }).catch((error) => {
      console.error('Erro ao fazer upload:', error);
      reject(error);
    });
  });
}

// Função para gravar dados no Realtime Database
function writeUserData(selectedTxt, URL, lat, lng) {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  if (!selectedTxt || typeof selectedTxt !== 'string') {
    console.error('O texto da descrição está inválido:', selectedTxt);
    return;
  }

  // Criar uma nova entrada única com `push()`
  const newDescriptionRef = push(databaseRef(database, 'description/'));

  // Gravar o texto e a URL da imagem
  set(newDescriptionRef, {
    text: selectedTxt,
    imageUrl: URL,
    user: userInfo.nome,
    city: userInfo.cidade,
    latUser: lat,
    lngUser: lng,
  })
    .then(() => {
      console.log("Texto, URL e outras informações foram enviadas com sucesso");
      window.location.href = "feed2.html";
    })
    .catch((error) => {
      console.error("Erro ao enviar texto:", error);
    });
}

// Função principal chamada ao clicar no botão
function handleButtonClick() {
  const descriptionInput = document.getElementById('description_input').value;
  selectedTxt = descriptionInput;

  obterCoordenadasUsuario(function(lat, lng) {
    // Primeiro faz o upload da imagem, depois grava os dados
    uploadImage().then((url_imagem) => {
      writeUserData(selectedTxt, url_imagem, lat, lng); // Passando os parâmetros necessários
    }).catch((error) => {
      console.error('Erro durante o processo:', error);
    });
  });
}


console.log("Estou no Firebase");

document.addEventListener('DOMContentLoaded', function () {
  const botao = document.getElementById('buttonAPP');
  if (botao) {
    botao.addEventListener('click', function () {
      console.log("Botão do aplicativo clicado."); // Adicionado para depuração
      handleButtonClick();
    });
  }
});

/************************************************************************************/
