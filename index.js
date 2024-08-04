
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("senha").value;
    firebase.auth().signInWithEmailAndPassword(email, password).then(response => {
        window.location.href = "feed.html";
    }).catch(error => {
        console.log('error', error);
    });
}

