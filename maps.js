

/*
Preciso receber as variaveis latUser e lngUser,
pois cada rua tem lng e lat, definindo assim, onde o icone estará
receberei elas do feed, pois armazenarei na publicacao as coordenadas por meio do banco de dados 
*/




const firebaseConfig = {
    apiKey: "AIzaSyCBzItoPtnnZL3qZzaugxDwnzja2g_ddas",
    authDomain: "mescla-f9d00.firebaseapp.com",
    databaseURL: "https://mescla-f9d00-default-rtdb.firebaseio.com",
    projectId: "mescla-f9d00",
    storageBucket: "mescla-f9d00.appspot.com",
    messagingSenderId: "442057041731",
    appId: "1:442057041731:web:a5d7208555136ba97531f6",
  };

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
          console.log("Deu certo receber: " + latUser);

          callback(location.lat(), location.lng());
        } else {
          console.error('Geocode falhou: ' + status);
        }
      });
    }
    let map; // Variável global para o mapa

    function initMap(lat, lng) {
      // Inicializa o mapa com a posição recebida
      const initialPosition = { lat: lat, lng: lng }; // Usar as coordenadas recebidas
      map = new google.maps.Map(document.getElementById("mapContainer"), {
        center: initialPosition,
        zoom: 12,
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