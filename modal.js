var modal = document.getElementById("janela-modal");
  
    var btn = document.querySelector(".publish-button");
  
    var span = document.getElementsByClassName("close")[0];
  
    btn.onclick = function() {
      modal.style.display = "block";
    }
  
    span.onclick = function() {
      modal.style.display = "none";
    }
  
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }