

const admin = require('firebase-admin');
const serviceAccount = require("C:\GitHub\MESCLA\mescla-f9d00-firebase-adminsdk-nlq21-776e10d0ac.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://console.firebase.google.com/u/0/project/mescla-f9d00/database/mescla-f9d00-default-rtdb/data/~2F'  // URL do banco de dados Firebase Realtime ou Firestore
});

const db = admin.firestore();  // Para usar o Firestore
// Ou
const rtdb = admin.database(); // Para usar o Firebase Realtime Database


//Captura o botao pelo id
const botaoModal = document.getElementById('botaoModal');

//Mexeer nisso futuramente 
// Adiciona um evento de clique ao botão
botaoModal.addEventListener('click', function(event) {
    event.preventDefault(); // Previne o comportamento padrão do botão (submeter formulário)

    // Código a ser executado quando o botão for clicado

    alert('Você clicou em Publicar!');
    console.log("O botão Publicar foi clicado.");
});


function filtrarConteudo(){
   
}