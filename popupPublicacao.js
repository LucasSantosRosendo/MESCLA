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
let usersData = null;
let userInfo = null;
let userName = null;
let userCity = null;

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
      getUsers();
    });
  }
});

function getUsers() {
  const usersRef = databaseRef(database, 'users'); // Referência correta à pasta "users"
  get(usersRef)
    .then((snapshot) => {
      const usersData = snapshot.val();
      
      console.log("Dados retornados do Realtime Database:", usersData); // Verifique os dados retornados
      
      if (usersData) {
        findUserByID(usersData, UserId); // Somente chamar se houver dados
      } else {
        console.error("Nenhum dado encontrado no banco de dados.");
      }
    })
    .catch((error) => {
      console.error("Erro ao ler dados: ", error);
    });
}


// Função para encontrar o usuário pelo ID
function findUserByID(usersData, UserID) {
  for (const key in usersData) {
   console.log("Comparando:", usersData[key].userId, UserId); // Verifica se o userId existe e se a comparação é correta
    if (usersData[key].userId === UserId) {
      // Quando encontrar, armazene as informações em variáveis
      userInfo = usersData[key];
      userName = usersData[key].nome;  // Corrigir para usar os dados corretos
      userCity = usersData[key].cidade; // Corrigir para usar os dados corretos

      // Agora que os dados foram atribuídos, exiba-os
      console.log("Usuário encontrado: ", userName);
      console.log("Cidade do usuário: ", userCity);

      break; // Opcional: parar ao encontrar o primeiro
    }
    else{
      console.log(usersData[key].UserId);
    }
  }
}


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
function writeUserData(selectedTxt, URL) {
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
    writeUserData(selectedTxt, url_imagem, /*userId*/); // Passando userId aqui
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
