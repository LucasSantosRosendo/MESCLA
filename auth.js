
const firebaseAppScript = document.createElement('script');
firebaseAppScript.src = "https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js";
document.head.appendChild(firebaseAppScript);

const firebaseAuthScript = document.createElement('script');
firebaseAuthScript.src = "https://www.gstatic.com/firebasejs/8.6.8/firebase-auth.js";
document.head.appendChild(firebaseAuthScript);

firebaseAppScript.onload = function() {
  firebaseAuthScript.onload = function() {
    if (!firebase.apps.length) {
        

      const firebaseConfig = {
        apiKey: "AIzaSyCBzItoPtnnZL3qZzaugxDwnzja2g_ddas",
        authDomain: "mescla-f9d00.firebaseapp.com",
        databaseURL: "https://mescla-f9d00-default-rtdb.firebaseio.com",
        projectId: "mescla-f9d00",
        storageBucket: "mescla-f9d00.appspot.com",
        messagingSenderId: "442057041731",
        appId: "1:442057041731:web:a5d7208555136ba97531f6"
      };

      firebase.initializeApp(firebaseConfig);
    } else {
      console.log("Firebase já foi inicializado.");
    }

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("Usuário autenticado:", user.uid);
      } else {
        window.location.href = "index.html";
      }
    });
  };
};


