/************************************************************************************/ 
// Inicialização do Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';
import { getDatabase, ref as databaseRef, push, set } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getUsuarioAutenticado } from './authPublicacao.js';

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
let userId = null;

// Referências relacionadas à imagem
const inputFile = document.querySelector("#picture__input");
const pictureImage = document.querySelector(".picture__image");
const pictureImageTxt = "Choose an image";
pictureImage.innerHTML = pictureImageTxt;

console.log("Início popup");
/*document.addEventListener("DOMContentLoaded", () => {
  getUsuarioAutenticado()
  getUsers();
  findUserByID(usersData, userID);
});
// Obtém o usuário autenticado de authPublicacao
getUsuarioAutenticado()
  .then((userId) => {
    console.log("Usuário autenticado:", userId);
    userId = userId; // Armazena o userId para uso posterior
    //chamar as funções que necessitam do userId
    getUsers();
  })
  .catch((error) => {
    console.error(error);
    window.location.href = "login.html"; // Redireciona se não estiver autenticado
  });
  
// Função para obter os dados dos usuários
function getUsers() {
    const usersRef = database.ref('users'); // Referência à pasta "users"
    usersRef.once('value')
        .then((snapshot) => {
            const usersData = snapshot.val();
            findUserByID(usersData, userId);
        })
        .catch((error) => {
            console.error("Erro ao ler dados: ", error);
        });
}

// Função para encontrar o usuário pelo ID
function findUserByID(usersData, userID) {
    for (const key in usersData) {
        if (usersData[key].userId === userId) {
            // Quando encontrar, armazene as informações em variáveis
            const userInfo = usersData[key];
            const userName = nome
            const userEmail = cidade

            console.log(`Usuário encontrado: ${userName}, Email: ${userEmail}`);
            // Aqui você pode usar as variáveis como precisar
            break; // Opcional: parar ao encontrar o primeiro
        }
    }
}


*/
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
function writeUserData(selectedTxt, URL, userId) {
  if (!selectedTxt || typeof selectedTxt !== 'string') {
    console.error('O texto da descrição está inválido:', selectedTxt);
    return;
  }

  if (!userId) {
    console.error('O userId está inválido:', userId);
    return;
  }

  // Criar uma nova entrada única com `push()`
  const newDescriptionRef = push(databaseRef(database, 'description/'));

  // Gravar o texto e a URL da imagem
  set(newDescriptionRef, {
    userId: userId, 
    text: selectedTxt,
    imageUrl: URL,
  })
  .then(() => {
    console.log("Texto e URL enviados com sucesso");
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
    writeUserData(selectedTxt, url_imagem, userId); // Passando userId aqui
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
