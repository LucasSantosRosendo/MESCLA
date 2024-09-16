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

const firebaseConfig = {
  apiKey: "AIzaSyCBzItoPtnnZL3qZzaugxDwnzja2g_ddas",
  authDomain: "mescla-f9d00.firebaseapp.com",
  projectId: "mescla-f9d00",
  storageBucket: "mescla-f9d00.appspot.com",
  messagingSenderId: "442057041731",
  appId: "1:442057041731:web:a5d7208555136ba97531f6",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

document.getElementById("submit").addEventListener("click", function (event) {
  event.preventDefault();

  if (!validarForm()) {
    return;
  }

  const empresa = document.getElementById("empresa").value;
  const cnpj = document.getElementById("cnpj").value;
  const cidade = document.getElementById("cidade").value;
  const email = document.getElementById("email").value;
  const setorAtuacao = document.getElementById("setorAtuacao").value;
  const senha = document.getElementById("senha").value;
  const senha2 = document.getElementById("senha2").value;

  createUserWithEmailAndPassword(auth, email, senha)
    .then((userCredential) => {
      const user = userCredential.user;

      set(ref(database, "users/" + user.uid), {
        empresa: empresa,
        cnpj: cnpj,
        cidade: cidade,
        email: email,
        setorAtuacao: setorAtuacao,
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

function validarForm() {
  const empresa = document.getElementById("empresa").value.trim();
  const cidade = document.getElementById("cidade").value.trim();
  const email = document.getElementById("email").value.trim();
  const setorAtuacao = document.getElementById("setorAtuacao").value.trim();
  const senha = document.getElementById("senha").value;
  const senha2 = document.getElementById("senha2").value;

  if (
    !empresa ||
    !cidade ||
    !email ||
    !setorAtuacao ||
    !senha ||
    !senha2
  ) {
    Erro("Todos os campos são obrigatórios!");
    return false;
  }

  const emailValidacao = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailValidacao.test(email)) {
    Erro("Por favor, insira um email válido.");
    return false;
  }

  if (senha.length < 8) {
    Erro("A senha deve ter pelo menos 8 caracteres.");
    return false;
  }

  if (senha !== senha2) {
    Erro("As senhas não conferem.");
    return false;
  }

  return true;
}

function Erro(message, isError = true) {
  const errorMessageDiv = document.getElementById("error-message");
  errorMessageDiv.innerHTML = message;
  errorMessageDiv.style.color = isError ? "red" : "green";
  errorMessageDiv.style.display = "block";
}