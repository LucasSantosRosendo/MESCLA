
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";


  const firebaseConfig = {
    apiKey: "AIzaSyCBzItoPtnnZL3qZzaugxDwnzja2g_ddas",
    authDomain: "mescla-f9d00.firebaseapp.com",
    projectId: "mescla-f9d00",
    storageBucket: "mescla-f9d00.appspot.com",
    messagingSenderId: "442057041731",
    appId: "1:442057041731:web:a5d7208555136ba97531f6"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

    const submit = document.getElementById('submit');
    submit.addEventListener("click", function(event){
        event.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

        createUserWithEmailAndPassword(auth, email, senha)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("Criando conta...")
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage)
        })
    });
