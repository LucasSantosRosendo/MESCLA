import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";

// Configurações do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCBzItoPtnnZL3qZzaugxDwnzja2g_ddas",
  authDomain: "mescla-f9d00.firebaseapp.com",
  projectId: "mescla-f9d00",
  storageBucket: "mescla-f9d00.appspot.com",
  messagingSenderId: "442057041731",
  appId: "1:442057041731:web:a5d7208555136ba97531f6",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Captura o evento de envio do formulário
document.getElementById("submit").addEventListener("click", function (event) {
  event.preventDefault();

  // Captura os valores dos campos do formulário
  const nome = document.getElementById("nome").value;
  const nascimento = document.getElementById("nascimento").value;
  const cpf = document.getElementById("cpf").value;
  const cidade = document.getElementById("cidade").value;
  const bairro = document.getElementById("bairro").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const senha2 = document.getElementById("senha2").value;

  // Verifica se as senhas coincidem
  if (senha !== senha2) {
    alert("As senhas não coincidem!");
    return;
  }

  // Cria o usuário no Firebase Authentication
  createUserWithEmailAndPassword(auth, email, senha)
    .then((userCredential) => {
      const user = userCredential.user;

      // Salva os dados adicionais no Firebase Realtime Database
      set(ref(database, "users/" + user.uid), {
        nome: nome,
        nascimento: nascimento,
        cpf: cpf,
        cidade: cidade,
        bairro: bairro,
        email: email,
      })
        .then(() => {
          alert("Conta criada e dados salvos com sucesso!");
          window.location.href = "login.html";
        })
        .catch((error) => {
          alert("Erro ao salvar os dados: " + error.message);
        });
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert("Erro ao criar conta: " + errorMessage);
    });
});
