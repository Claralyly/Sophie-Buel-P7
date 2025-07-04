document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".gallery");
  const filtres = document.querySelectorAll("#filtres button");
  let allProjects = [];

  // Charger les projets depuis l'API
  async function chargerProjets() {
    try {
      const response = await fetch("http://localhost:5678/api/works");
      allProjects = await response.json();
      afficherProjets(allProjects);
    } catch (error) {
      console.error("Erreur lors du chargement des projets :", error);
    }
  }

  // Afficher des projets dans la galerie
  function afficherProjets(liste) {
    gallery.innerHTML = ""; // Nettoyage
    liste.forEach((projet) => {
      const figure = document.createElement("figure");

      const img = document.createElement("img");
      img.src = projet.imageUrl;
      img.alt = projet.title;
      img.setAttribute("data-id", projet.id); // 👈 À placer ici
      
      const caption = document.createElement("figcaption");
      caption.textContent = projet.title;

      figure.appendChild(img);
      figure.appendChild(caption);
      gallery.appendChild(figure);
    });
  }

  // Écoute les clics sur les boutons filtres
  filtres.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filtre = btn.dataset.filter;

      if (filtre === "all") {
        afficherProjets(allProjects);
      } else {
        const projetsFiltres = allProjects.filter((projet) =>
          projet.category.name.toLowerCase() === filtre.toLowerCase()
        );
        afficherProjets(projetsFiltres);
      }
    });
  });

  // Lancer le chargement dès le début
  chargerProjets();
  
  // Ajouter un projet dans la galerie principale
function ajouterProjetDansGalerie(projet) {
  const gallery = document.querySelector(".gallery");
  if (!gallery) return;

  const figure = document.createElement("figure");

  const img = document.createElement("img");
  img.src = projet.imageUrl;
  img.alt = projet.title || "Projet";
  img.setAttribute("data-id", projet.id);

  const caption = document.createElement("figcaption");
  caption.textContent = projet.title || "Projet";

  figure.appendChild(img);
  figure.appendChild(caption);
  gallery.appendChild(figure);
}

// Supprimer un projet de la galerie principale
function supprimerProjetDansGalerie(id) {
  const imgToRemove = document.querySelector(`.gallery img[data-id="${id}"]`);
  if (imgToRemove) {
    const figure = imgToRemove.closest("figure");
    if (figure) {
      figure.remove();
    }
  }
}

//  Rendre les fonctions accessibles depuis modale.js
window.ajouterProjetDansGalerie = ajouterProjetDansGalerie;
window.supprimerProjetDansGalerie = supprimerProjetDansGalerie;

});
