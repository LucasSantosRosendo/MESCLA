/************************************************************************************/ 
// Inicialização do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';
import { getDatabase, ref as databaseRef, push, set, get} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

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

/************************************************************************************/

// Variáveis globais para armazenar o arquivo selecionado e a descrição
let selectedFile = null;
let selectedTxt = null;
let URL = null;
let UserId = null;



    // Verifica se o usuário está logado
    firebase.auth().onAuthStateChanged(function(user) {
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
const pictureImageTxt = "Choose an image";
pictureImage.innerHTML = pictureImageTxt;

console.log("Início popup");

document.addEventListener('DOMContentLoaded', function() {
  const botaoAdd = document.getElementById('addbutton');
  if (botaoAdd) {
    botaoAdd.addEventListener('click', function() {
      firebase.auth();
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
// Obtém os dados do Local Storage


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
function writeUserData(selectedTxt, URL) {
   
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

  // Primeiro faz o upload da imagem, depois grava os dados
  uploadImage().then((url_imagem) => {
      writeUserData(selectedTxt, url_imagem); // Passando os parâmetros necessários
  }).catch((error) => {
    console.error('Erro durante o processo:', error);
  });
}

console.log("Estou no Firebase");

document.addEventListener('DOMContentLoaded', function() {
  const botao = document.getElementById('buttonAPP');
  if (botao) {
    botao.addEventListener('click', function() {
      handleButtonClick();
    });
  }
});

/************************************************************************************/
