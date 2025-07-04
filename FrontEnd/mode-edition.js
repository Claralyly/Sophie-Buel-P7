document.addEventListener('DOMContentLoaded', function () {
  function editionMode() {
    const body = document.querySelector("body");
    const editMode = document.createElement("div");
    editMode.innerHTML = `<span><i class="fa-regular fa-pen-to-square"></i></span><p>Mode Edition</p>`;
    editMode.classList.add("edit-mode");
    body.prepend(editMode);

    const logOut = document.getElementById("logout");
    if (logOut) logOut.innerHTML = "logout";

    const divModifier = document.querySelector(".modifier");
    if (!divModifier) {
      console.warn("Le bouton 'modifier' est introuvable");
      return;
    }

    divModifier.classList.add("btn-modifier");
    divModifier.innerHTML = `<i class="fa-regular fa-pen-to-square"></i><a>Modifier</a>`;

    // Ouvre proprement la modale 1
    divModifier.addEventListener("click", function (event) {
      event.preventDefault();
      const fondModale = document.getElementById("maModale");
      const modal1 = document.querySelector(".modalinter");
      const modal2 = document.querySelector(".addPhoto");

      if (fondModale) fondModale.style.display = "block";
      if (modal1) modal1.style.display = "block";
      if (modal2) modal2.style.display = "none";
    });
  }

  editionMode();
});
