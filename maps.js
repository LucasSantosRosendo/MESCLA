import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';
import { getDatabase, ref as databaseRef, get } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js"; // Importa o método 'get'

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

let latitude = null;
let longitude = null;

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

document.getElementById("openMapBtn").addEventListener("click", function () {
  document.getElementById("map").style.display = "block";
  // Chame a função para obter as coordenadas
  obterCoordenadas();
});
