document.addEventListener("DOMContentLoaded", () => {
  // === PARTIE 1 : Connexion depuis login.html ===
  const formLogin = document.querySelector("form");
  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      if (!email || !password) {
        alert("Veuillez remplir tous les champs.");
        return;
      }

      try {
        const response = await fetch("http://localhost:5678/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("token", data.token);
          window.location.href = "index.html";
        } else {
          alert("Identifiants incorrects");
        }
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        alert("Une erreur est survenue.");
      }
    });
  }

  // === PARTIE 2 : Masquer les éléments d’édition si non connecté ===
  function masquerElementsEdition() {
    const barreEdition = document.querySelector(".edit-mode");
    if (barreEdition) barreEdition.style.display = "none";

    const boutonsModifier = document.querySelectorAll(".modifier");
    boutonsModifier.forEach((btn) => {
      btn.style.display = "none";
    });

    const filtres = document.getElementById("filtres");
    if (filtres) filtres.style.display = "flex";
  }

  const token = localStorage.getItem("token");

  if (!token) {
    masquerElementsEdition();
  }

  // === PARTIE 3 : Affichage dynamique login / logout dans la navbar ===
  const logoutLi = document.getElementById("logout");

  if (logoutLi) {
    if (token) {
      logoutLi.innerHTML = '<a href="#" id="logoutLink">logout</a>';

      // Cache les filtres en mode connecté (admin)
      const filtres = document.getElementById("filtres");
      if (filtres) filtres.style.display = "none";
    } else {
      logoutLi.innerHTML = '<a href="login.html">login</a>';

      // Affiche les filtres si visiteur
      const filtres = document.getElementById("filtres");
      if (filtres) filtres.style.display = "flex";
    }
  }

  // === PARTIE 4 : Déconnexion propre ===
  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "logoutLink") {
      e.preventDefault();
      localStorage.removeItem("token");
      masquerElementsEdition();

      const filtres = document.getElementById("filtres");
      if (filtres) filtres.style.display = "flex";

      window.location.href = "index.html";
    }
  });
  // Filtre déconnecté
});
