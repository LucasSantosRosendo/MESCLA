/************************************************************************************/
// Inicialização do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js';

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

/************************************************************************************/
// Variável global para armazenar o arquivo selecionado 
let selectedFile = null;

// Recebimentos relacionados à imagem
const inputFile = document.querySelector("#picture__input");
const pictureImage = document.querySelector(".picture__image");
const pictureImageTxt = "Choose an image";
pictureImage.innerHTML = pictureImageTxt;

console.log("Início popup");

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

function uploadImage() {
  const storage = getStorage();
  
  // Gerar um nome único para a imagem usando o timestamp
  const uniqueImageName = `images/${Date.now()}_${selectedFile.name}`;
  
  // Criar uma referência única no Storage
  const storageRef = ref(storage, uniqueImageName);

  // Fazer o upload do arquivo
  uploadBytes(storageRef, selectedFile).then((snapshot) => {
    console.log('Upload de arquivo completo!');
  }).catch((error) => {
    console.error('Erro ao fazer upload:', error);
  });
}

console.log("Estou no Firebase");

document.addEventListener('DOMContentLoaded', function() {
  const botao = document.getElementById('buttonAPP');
  if (botao) {
    botao.addEventListener('click', function() {
      uploadImage();
    });
  }
});

/*
Olhar a documentação:
https://firebase.google.com/docs/web/modular-upgrade
https://firebase.google.com/docs/storage/web/start
https://firebase.google.com/docs/storage/web/download-files
*/
/************************************************************************************/
