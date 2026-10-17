const articles = [
  { id: 1, nom: "Abaya Noire Élégante", prix: 350, categorie: "Abayas",  image: "images/abaya1.jpg" },
  { id: 2, nom: "Hijab Soie Rose",      prix: 120, categorie: "Hijabs",  image: "images/hijab1.jpg" },
  { id: 3, nom: "Caftan Brodé Beige",   prix: 600, categorie: "Caftans", image: "images/caftan1.jpg" },
  { id: 4, nom: "Abaya Lavande",        prix: 380, categorie: "Abayas",  image: "images/abaya2.jpg" },
  { id: 5, nom: "Hijab Jersey Beige",   prix: 90,  categorie: "Hijabs",  image: "images/hijab2.jpg" },
  { id: 6, nom: "Caftan Rose Poudré",   prix: 650, categorie: "Caftans", image: "images/caftan2.jpg" }
];

const conteneur = document.getElementById("produits");
const compteur = document.getElementById("compteur");
let panier = [];

function afficherArticles(liste) {
  conteneur.innerHTML = "";
  liste.forEach(article => {
    conteneur.innerHTML += `
      <div class="card">
        <img src="${article.image}" alt="${article.nom}" onerror="this.style.display='none'">
        <h3>${article.nom}</h3>
        <p class="prix">${article.prix} DH</p>
        <button class="btn-ajouter" data-id="${article.id}">Ajouter au panier</button>
      </div>
    `;
  });
}

// Filtres
const boutons = document.querySelectorAll(".filtre");
boutons.forEach(bouton => {
  bouton.addEventListener("click", () => {
    boutons.forEach(b => b.classList.remove("actif"));
    bouton.classList.add("actif");

    const cat = bouton.dataset.cat;
    if (cat === "Tous") {
      afficherArticles(articles);
    } else {
      afficherArticles(articles.filter(a => a.categorie === cat));
    }
  });
});

// Ajouter au panier (compteur)
conteneur.addEventListener("click", e => {
  if (e.target.classList.contains("btn-ajouter")) {
    const id = Number(e.target.dataset.id);
    const article = articles.find(a => a.id === id);
    panier.push(article);
    compteur.textContent = panier.length;
  }
});

afficherArticles(articles);