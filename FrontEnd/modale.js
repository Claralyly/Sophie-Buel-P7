document.addEventListener("DOMContentLoaded", () => {
  const fondModale = document.getElementById("maModale");
  const modal1 = document.querySelector(".modalinter");
  const modal2 = document.querySelector(".addPhoto");
  const btnAjout = document.querySelector(".btnajt");
  const flecheRetour = document.querySelector(".fleche");
  const openButton = document.querySelector(".modifier");
  const worksDom = document.querySelector(".section-image");

  // Masquer toutes les modales au démarrage
  if (fondModale) fondModale.style.display = "none";
  if (modal1) modal1.style.display = "none";
  if (modal2) modal2.style.display = "none";

  // Fonction de récupération des travaux
  const getWorks = async () => {
    try {
      const response = await fetch("http://localhost:5678/api/works");
      if (!response.ok) throw new Error("Réponse invalide de l’API");
      return await response.json();
    } 
    
    catch (error) {
      console.error("Erreur lors de la récupération des travaux :", error);
      return [];
      
    }
    
  };

  // Fonction d’affichage des travaux dans la modale
  async function displayTravauxModal() {
    worksDom.innerHTML = "";
    const works = await getWorks();
    console.table(works);

    works.forEach((work) => {
      const workWrapper = document.createElement("div");
      workWrapper.classList.add("work-item");

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.id = work.id;

      const deleteIcon = document.createElement("i");
      deleteIcon.className = "fas fa-trash-can";

      deleteIcon.addEventListener("click", async () => {
        const token = localStorage.getItem("token");
        const idToDelete = work.id;

        try {
          const reponse = await fetch(`http://localhost:5678/api/works/${idToDelete}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

         const messageDiv = document.querySelector(".modale-error-message");
        messageDiv.classList.remove("message-success", "message-error");
        messageDiv.textContent = "";

        if (reponse.status === 204 || reponse.status === 200) {
          messageDiv.textContent = "Élément supprimé avec succès.";
          messageDiv.classList.add("message-success");
          workWrapper.remove();

          const imgToRemove = document.querySelector(`.gallery img[data-id="${idToDelete}"]`);
          if (imgToRemove) {
            imgToRemove.closest("figure").remove();
          }
        } else if (reponse.status === 401) {
          messageDiv.textContent = "Non autorisé : vous n’avez pas les droits.";
          messageDiv.classList.add("message-error");
        } else {
          messageDiv.textContent = "Erreur : l’élément n’a pas pu être supprimé.";
          messageDiv.classList.add("message-error");
        }

      } catch (err) {
        console.error("Erreur réseau lors de la suppression :", err);
        alert("Une erreur réseau s’est produite.");
      }
    });

    workWrapper.appendChild(img);
    workWrapper.appendChild(deleteIcon);
    worksDom.appendChild(workWrapper);
  });
}

  // Initialisation de l’affichage
  displayTravauxModal();


  
    // Ouvrir la modale 1
    if (openButton) {
      openButton.addEventListener("click", (e) => {
        e.preventDefault();
        fondModale.style.display = "flex"; // Affiche le fond de la modale
        modal1.style.display = "block"; // Affiche la modale 1
        modal2.style.display = "none"; // Assure que la modale 2 est cachée
        displayTravauxModal(); // Recharge les images à chaque ouverture
        const messageDiv = document.querySelector(".modalinter .modale-error-message");
if (messageDiv) {
  messageDiv.textContent = "";
  messageDiv.style.color = "";
}
      });
    }
    

  
    // Aller à la modale 2
if (btnAjout) {
  btnAjout.addEventListener("click", () => {
    modal1.style.display = "none";
    modal2.style.display = "block";
    chargerCategories(); // recharge les catégories

    // Réinitialiser le formulaire
    const form = document.getElementById("form-photo");
    if (form) form.reset();

    // Supprimer l’image prévisualisée
    const previewImg = document.getElementById("displayedImage");
    if (previewImg) previewImg.remove();

    // Réafficher l’icône et le label
    const icon = document.querySelector(".add-img");
    const label = document.querySelector("label.file");
    if (icon) icon.style.display = "block";
    if (label) label.style.display = "block";

    // Réinitialiser le message d’erreur
    const messageDiv = document.querySelector(".addPhoto .modale-error-message");
    if (messageDiv) {
      messageDiv.textContent = "";
      messageDiv.style.color = "";
    }
  });
}

  
    // Retour à la modale 1
    if (flecheRetour) {
      flecheRetour.addEventListener("click", () => {
        modal2.style.display = "none";
        modal1.style.display = "block";
      });
    }
  
    // Fermer avec les croix ✖
    document.addEventListener("click", (e) => {
      if (e.target.closest(".close")) {
        fondModale.style.display = "none";
        modal1.style.display = "none";
        modal2.style.display = "none";

         const messageDiv = document.querySelector(".modale-error-message");
  if (messageDiv) {
    messageDiv.textContent = "";
    messageDiv.style.color = "";
    }
      }
    });
  
    // Fermer au clic extérieur
    document.addEventListener("click", (e) => {
      const clicDansModale =
        modal1.contains(e.target) || modal2.contains(e.target);
      if (
        fondModale.style.display === "flex" &&
        fondModale.contains(e.target) &&
        !clicDansModale
      ) {
        fondModale.style.display = "none";
        modal1.style.display = "none";
        modal2.style.display = "none";
      }
     

    });
  
    // Aperçu image
    document.addEventListener("change", (e) => {
        if (e.target && e.target.id === "file") {
          const file = e.target.files[0];
          if (!file) return;
    
          const reader = new FileReader();
          reader.onload = (event) => {
            let previewImg = document.getElementById("displayedImage");
            if (!previewImg) {
              previewImg = document.createElement("img");
              previewImg.id = "displayedImage";
              document.querySelector(".containerPhoto").appendChild(previewImg);
            }
            previewImg.src = event.target.result;
            previewImg.style.display = "block";
    
            const icon = document.querySelector(".add-img");
            const label = document.querySelector("label.file");
            if (icon) icon.style.display = "none";
            if (label) label.style.display = "none";
          };
    
          reader.readAsDataURL(file);
        }
      });
    // bande déroulante
      async function injecterTexteDepuisAPI() {
        try {
          const reponse = await fetch("http://localhost:5678/api/message");
          const data = await reponse.json();
          const message = data.message;
      
          // Nettoie une éventuelle ancienne bande
          const ancienneBande = document.querySelector(".bande-roulante");
          if (ancienneBande) {
            ancienneBande.remove();
          }
      
          // Crée et insère la nouvelle bande
          const bande = document.createElement("div");
          bande.className = "bande-roulante";
          bande.textContent = message;
      
          const labelTitre = document.querySelector('label[for="title"]');
          if (labelTitre && labelTitre.parentNode) {
            labelTitre.parentNode.insertBefore(bande, labelTitre);
          }
        } catch (error) {
          console.error("Erreur chargement texte API :", error);
        }
      }
      async function chargerCategories() {
        try {
          const response = await fetch("http://localhost:5678/api/categories");
          const categories = await response.json();
      
          const select = document.getElementById("category"); // ← c’est bien "category" ici
          select.innerHTML = ""; // Nettoyer avant d'ajouter
      
          // Ajouter une option par défaut
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Choisissez une catégorie";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    // Ajouter les vraies catégories
    categories.forEach((categorie) => {
      const option = document.createElement("option");
      option.value = categorie.id;
      option.textContent = categorie.name;
      select.appendChild(option);
    });
        } catch (error) {
          console.error("Erreur lors du chargement des catégories :", error);
        }
      }
      btnAjout.addEventListener("click", () => {
        modal1.style.display = "none";
        modal2.style.display = "block";
        chargerCategories(); //l’appel est bon ici
      });
     // Ajouter une photo sur première modale //
const btnValider = document.querySelector(".btn-valider");

if (btnValider) {
  btnValider.addEventListener("click", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const imageFile = document.getElementById("file").files[0];

   const messageDiv = document.querySelector(".addPhoto .modale-error-message");
   console.log("messageDiv trouvé ?", messageDiv);

messageDiv.textContent = "";


if (!title || !category || !imageFile) {
  
  messageDiv.textContent = "Merci de remplir tous les champs avant de valider.";
  
  
  return;
}
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", parseInt(category));
    formData.append("image", imageFile);

    const token = localStorage.getItem("token");
    console.log("Token utilisé :", token);

    for (let pair of formData.entries()) {
      console.log(pair[0] + ' ➜', pair[1]);
    }

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

     if (!response.ok) {
  if (response.status === 400) {
    messageDiv.textContent = "Requête invalide : vérifie les champs.";
  } else if (response.status === 401) {
    messageDiv.textContent = "Non autorisé : tu dois être connecté.";
  } else if (response.status === 500) {
    messageDiv.textContent = "Erreur serveur. Réessaie plus tard.";
  } else {
    messageDiv.textContent = "Une erreur est survenue lors de l'ajout.";
  }
  
  return;
}


      const newWork = await response.json();
      console.log("Nouvel élément ajouté :", newWork);
      ajouterProjetDansGalerie(newWork);
      




      // Ajout immédiat du nouvel élément dans la galerie
      const workWrapper = document.createElement("div");
      workWrapper.classList.add("work-item");

      const img = document.createElement("img");
      img.src = newWork.imageUrl;
      img.id = newWork.id;

      const deleteIcon = document.createElement("i");
      deleteIcon.className = "fas fa-trash-can";

      deleteIcon.addEventListener("click", async () => {
        try {
          const res = await fetch(`http://localhost:5678/api/works/${newWork.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          if (res.ok) {
            workWrapper.remove();
          } else {
            alert("Erreur lors de la suppression");
          }
        } catch (err) {
          console.error("Erreur suppression :", err);
          alert("Impossible de supprimer l’image");
        }
      });

      workWrapper.appendChild(img);
      workWrapper.appendChild(deleteIcon);
      worksDom.appendChild(workWrapper);
      

      //  Fermer entièrement la modale
      document.querySelector(".modal").style.display = "none";

      // Réinitialiser le formulaire
      document.getElementById("form-photo").reset();

      const previewImg = document.getElementById("displayedImage");
      if (previewImg) previewImg.style.display = "none";

      const icon = document.querySelector(".add-img");
      const label = document.querySelector("label.file");
      if (icon) icon.style.display = "block";
      if (label) label.style.display = "block";

    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      
    }
  });
}


     

  });
  
