

/*
Com os valores de lat e lng que tenho posso pegar os valores para adicionar no mapa as publicações 
para poder utilizar isso é necessario configurar o fire base
TENHO UE ARRUMAR O SCROLL E O LIMITE DA PAGINA

*/

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js';
import { getDatabase, ref as databaseRef, push, set } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";



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

let latUser = null;
let lngUser = null;


function getCoordinates(cidade, callback) {
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address: cidade }, function (results, status) {
    if (status === 'OK') {
      const location = results[0].geometry.location;
      // Imprime latitude e longitude no console
      console.log("Latitude: " + location.lat());
      console.log("Longitude: " + location.lng());

      callback(location.lat(), location.lng());
    } else {
      console.error('Geocode falhou: ' + status);
    }
  });
}
let map; // Variável global para o mapa

function initMap(lat, lng) {
  // Inicializa o mapa com a posição recebida
  console.log("Lat no initMAp" + lat);
  console.log("Lng no initMAp" + lng);

  const initialPosition = { lat: lat, lng: lng }; // Usar as coordenadas recebidas
  map = new google.maps.Map(document.getElementById("mapContainer"), {
    center: initialPosition,
    zoom: 12,
  });
}

function loadMarkers(map) {
  const databaseRef = firebase.database().ref('description');

  // Listener para adicionar novos marcadores conforme as publicações são feitas
  databaseRef.on('child_added', (snapshot) => {
    const data = snapshot.val();

    console.log("Passou no maps" + data.latUser);

    // Verifica se as coordenadas estão disponíveis
    if (data.latUser && data.lngUser) {
      const marker = new google.maps.Marker({
        position: { lat: data.latUser, lng: data.lngUser },
        map: map,
        icon: 'components/images/pointer.png',
      });

      // Adicionar evento de clique no marcador para mostrar o pop-up com a publicação
      marker.addListener('click', () => {
        const contentString = `
                      <div>
                          <p>${data.text}</p>
                          ${data.imageUrl ? `<img src="${data.imageUrl}" alt="Imagem da Publicação" style="width:100px;">` : ''}
                          ${data.videoUrl ? `<video controls style="width:100px;"><source src="${data.videoUrl}" type="video/mp4"></video>` : ''}
                      </div>`;

        const infowindow = new google.maps.InfoWindow({
          content: contentString,
        });

        infowindow.open(map, marker);
      });
    }
  });
}

document.getElementById("openMapBtn").addEventListener("click", function () {
  document.getElementById("mapContainer").style.display = "block";

  // Pega a cidade do localStorage
  const cidade = localStorage.getItem('cidade');
  // Verifica se a cidade foi recuperada e, em seguida, chama a função para obter as coordenadas
  if (cidade) {
    console.log("Cidade recuperada do localStorage:", cidade);

    // Chama a função getCoordinates passando a cidade
    getCoordinates(cidade, (lat, lng) => {
      console.log("Coordenadas recebidas:", lat, lng);

      // Chama initMap passando as coordenadas recebidas
      initMap(lat, lng);
    });
  } else {
    console.error('Cidade não está disponível no localStorage.');
  }
});
