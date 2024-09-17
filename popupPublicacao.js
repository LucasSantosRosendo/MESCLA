
/************************************************************************************/
//inicializacao do fire base
//preciso referenciar stack overflow e krintas erro no console do beowser
/*
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes} from 'firebase/storage';
*/

// firebaseConfig.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';
import { getStorage, ref, uploadBytes} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js';

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

// TODO: Replace the following with your app's Firebase project configuration

/*
console.log("passou firebaseconfig");

//Inicializa o firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// Referência ao Storage do Firebase
const storage = getStorage(app);
*/
/************************************************************************************/
// variavel global para armazenar o arquivo selecionado 
let selectedFile = null;

//recebimentos relacionados à imagem
const inputFile = document.querySelector("#picture__input");
const pictureImage = document.querySelector(".picture__image");
const pictureImageTxt = "Choose an image";
pictureImage.innerHTML = pictureImageTxt;

console.log("inicio popup");

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

 // Create a reference to 'images/mountains.jpg'
const storageRef = ref(storage, 'images/mountains.jpg');

  // 'file' comes from the Blob or File API
  uploadBytes(storageRef, selectedFile).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  });
}
console.log(" estou no firebase");


document.addEventListener('DOMContentLoaded', function() {
  const botao = document.getElementById('buttonAPP');
  if (botao) {
    botao.addEventListener('click', function() {
      uploadImage()

    });
  }
});


/*
olhar a documentação: https://firebase.google.com/docs/web/modular-upgrade
https://firebase.google.com/docs/storage/web/start
https://firebase.google.com/docs/storage/web/download-files
*/
/*
agora devo criar uma url da imagem para ter a possibilidade de armazenar a descrição juntamente à imagem 
além linkar o perfil com as publicações 
*/