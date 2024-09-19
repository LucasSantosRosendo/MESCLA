function showSection(sectionId, clickedTab) {
    // Oculta todas as seções
    var sections = document.querySelectorAll(".cubao > div");
    sections.forEach(function (section) {
        section.classList.remove("active");
    });

    // Remove a classe 'selected' de todos os botões
    var tabs = document.querySelectorAll(".box a");
    tabs.forEach(function (tab) {
        tab.classList.remove("selected");
    });

    // Mostra a seção correspondente
    var sectionToShow = document.getElementById(sectionId);
    sectionToShow.classList.add("active");
    
    // Marca o botão clicado como selecionado
    clickedTab.classList.add("selected");
}