// Inicialização do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';
import { getDatabase, ref as databaseRef, push, set } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js';

// Configuração do Firebase
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
const storage = getStorage(app);
const database = getDatabase(app);
const auth = getAuth(app);

let selectedFile = null;
let selectedTxt = null;
let UserId = null;

// Verifica se o usuário está logado
onAuthStateChanged(auth, (user) => {
  if (user) {
    UserId = user.uid;
  } else {
    window.location.href = "login.html";
  }
});

// Referências ao input de vídeo e preview
const inputFile = document.querySelector("#video__input");
const videoPreview = document.querySelector(".video__preview");
const videoPreviewTxt = "Escolha um vídeo";

// Evento de mudança para o input de arquivo de vídeo
inputFile.addEventListener("change", function (e) {
  const file = e.target.files[0];

  if (file) {
    selectedFile = file;
    const reader = new FileReader();

    reader.onload = function (e) {
      const video = document.createElement("video");
      video.src = e.target.result;
      video.controls = true;
      video.classList.add("video__preview-video");

      videoPreview.innerHTML = "";
      videoPreview.appendChild(video);
    };

    reader.readAsDataURL(file);
  } else {
    videoPreview.innerHTML = videoPreviewTxt;
  }
});

// Função para fazer o upload do vídeo para o Firebase Storage
function uploadVideo() {
  return new Promise((resolve, reject) => {
    const uniqueVideoName = `videos/${Date.now()}_${selectedFile.name}`;
    const videoRef = storageRef(storage, uniqueVideoName);

    // Upload do arquivo
    uploadBytes(videoRef, selectedFile).then((snapshot) => {
      return getDownloadURL(videoRef); // Obter a URL de download
    }).then((url_video) => {
      resolve(url_video);
    }).catch((error) => {
      reject(error);
    });
  });
}

// Função para salvar dados no Realtime Database
function writeUserData(description, videoUrl) {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const newVideoRef = push(databaseRef(database, 'videos/'));
  set(newVideoRef, {
    description: description,
    videoUrl: videoUrl,
    user: userInfo.nome,
    city: userInfo.cidade,
  })
  .then(() => {
    console.log("Dados enviados com sucesso");
  })
  .catch((error) => {
    console.error("Erro ao enviar dados:", error);
  });
}

// Função principal de envio
function handleButtonClick() {
  const descriptionInput = document.getElementById('description_input').value;
  selectedTxt = descriptionInput;

  uploadVideo().then((url_video) => {
    writeUserData(selectedTxt, url_video);
  }).catch((error) => {
    console.error('Erro durante o upload:', error);
  });
}

document.getElementById('buttonAPP').addEventListener('click', handleButtonClick);
