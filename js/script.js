// ===== Beddel had numero b numero dyal l'boutique (b 212, bla + w bla 0) =====
const NUMERO_WHATSAPP = "212600000000";

const articles = [
  { id: 1, nom: "Abaya Noire Élégante", prix: 350, categorie: "Abayas",  image: "images/abaya1.jpg" },
  { id: 2, nom: "Hijab Soie Rose",      prix: 120, categorie: "Hijabs",  image: "images/hijab1.jpg" },
  { id: 3, nom: "Caftan Brodé Beige",   prix: 600, categorie: "Caftans", image: "images/caftan1.jpg" },
  { id: 4, nom: "Abaya Lavande",        prix: 380, categorie: "Abayas",  image: "images/abaya2.jpg" },
  { id: 5, nom: "Hijab Jersey Beige",   prix: 90,  categorie: "Hijabs",  image: "images/hijab2.jpg" },
  { id: 6, nom: "Caftan Rose Poudré",   prix: 650, categorie: "Caftans", image: "images/caftan2.jpg" }
];

// ===== Éléments =====
const conteneur = document.getElementById("produits");
const compteur = document.getElementById("compteur");
const rechercheInput = document.getElementById("recherche");
const triSelect = document.getElementById("tri");
const boutonsFiltre = document.querySelectorAll(".filtre");
const tiroir = document.getElementById("tiroir");
const overlay = document.getElementById("overlay");
const panierArticles = document.getElementById("panier-articles");
const totalEl = document.getElementById("total");
const formCommande = document.getElementById("form-commande");

// ===== État =====
let categorieActive = "Tous";
let panier = chargerPanier(); // [{ id, qte }]

// ===== localStorage =====
function chargerPanier() {
  try {
    const data = localStorage.getItem("sitr-panier");
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}
function sauvegarderPanier() {
  try {
    localStorage.setItem("sitr-panier", JSON.stringify(panier));
  } catch (e) {}
}

// ===== Affichage des articles =====
function afficherArticles() {
  const texte = rechercheInput.value.trim().toLowerCase();

  let liste = articles.filter(a =>
    (categorieActive === "Tous" || a.categorie === categorieActive) &&
    a.nom.toLowerCase().includes(texte)
  );

  if (triSelect.value === "asc") liste.sort((a, b) => a.prix - b.prix);
  if (triSelect.value === "desc") liste.sort((a, b) => b.prix - a.prix);

  if (liste.length === 0) {
    conteneur.innerHTML = '<p class="vide">Aucun article trouvé.</p>';
    return;
  }

  conteneur.innerHTML = liste.map(a => `
    <div class="card">
      <img src="${a.image}" alt="${a.nom}" onerror="this.style.display='none'">
      <h3>${a.nom}</h3>
      <p class="prix">${a.prix} DH</p>
      <button class="btn-ajouter" data-id="${a.id}">Ajouter au panier</button>
    </div>
  `).join("");
}

// ===== Affichage du panier =====
function afficherPanier() {
  let total = 0;
  let nbArticles = 0;

  if (panier.length === 0) {
    panierArticles.innerHTML = '<p class="panier-vide">Votre panier est vide.</p>';
  } else {
    panierArticles.innerHTML = panier.map(ligne => {
      const a = articles.find(x => x.id === ligne.id);
      total += a.prix * ligne.qte;
      nbArticles += ligne.qte;
      return `
        <div class="ligne">
          <img src="${a.image}" alt="${a.nom}">
          <div class="ligne-infos">
            <h4>${a.nom}</h4>
            <p class="prix">${a.prix} DH</p>
            <div class="quantite">
              <button data-action="moins" data-id="${a.id}">-</button>
              <span>${ligne.qte}</span>
              <button data-action="plus" data-id="${a.id}">+</button>
            </div>
          </div>
          <button class="supprimer" data-action="supprimer" data-id="${a.id}">Supprimer</button>
        </div>
      `;
    }).join("");
  }

  totalEl.textContent = total;
  compteur.textContent = nbArticles;
  sauvegarderPanier();
}

// ===== Actions du panier =====
function ajouterAuPanier(id) {
  const ligne = panier.find(l => l.id === id);
  if (ligne) {
    ligne.qte += 1;
  } else {
    panier.push({ id: id, qte: 1 });
  }
  afficherPanier();
}

function changerQuantite(id, delta) {
  const ligne = panier.find(l => l.id === id);
  if (!ligne) return;
  ligne.qte += delta;
  if (ligne.qte <= 0) {
    panier = panier.filter(l => l.id !== id);
  }
  afficherPanier();
}

function supprimerDuPanier(id) {
  panier = panier.filter(l => l.id !== id);
  afficherPanier();
}

// ===== Tiroir =====
function ouvrirTiroir() {
  tiroir.classList.add("ouvert");
  overlay.classList.add("ouvert");
}
function fermerTiroir() {
  tiroir.classList.remove("ouvert");
  overlay.classList.remove("ouvert");
}

// ===== Événements =====
conteneur.addEventListener("click", e => {
  if (e.target.classList.contains("btn-ajouter")) {
    ajouterAuPanier(Number(e.target.dataset.id));
    ouvrirTiroir();
  }
});

panierArticles.addEventListener("click", e => {
  const action = e.target.dataset.action;
  if (!action) return;
  const id = Number(e.target.dataset.id);
  if (action === "plus") changerQuantite(id, 1);
  if (action === "moins") changerQuantite(id, -1);
  if (action === "supprimer") supprimerDuPanier(id);
});

boutonsFiltre.forEach(bouton => {
  bouton.addEventListener("click", () => {
    boutonsFiltre.forEach(b => b.classList.remove("actif"));
    bouton.classList.add("actif");
    categorieActive = bouton.dataset.cat;
    afficherArticles();
  });
});

rechercheInput.addEventListener("input", afficherArticles);
triSelect.addEventListener("change", afficherArticles);

document.getElementById("btn-panier").addEventListener("click", ouvrirTiroir);
document.getElementById("fermer").addEventListener("click", fermerTiroir);
overlay.addEventListener("click", fermerTiroir);

// ===== Commande sur WhatsApp =====
formCommande.addEventListener("submit", e => {
  e.preventDefault();

  if (panier.length === 0) {
    alert("Votre panier est vide.");
    return;
  }

  let total = 0;
  let message = "Bonjour, je souhaite passer commande :\n\n";

  panier.forEach(ligne => {
    const a = articles.find(x => x.id === ligne.id);
    total += a.prix * ligne.qte;
    message += `- ${a.nom} x${ligne.qte} : ${a.prix * ligne.qte} DH\n`;
  });

  message += `\nTotal : ${total} DH (paiement à la livraison)\n\n`;
  message += `Nom : ${document.getElementById("nom").value}\n`;
  message += `Téléphone : ${document.getElementById("tel").value}\n`;
  message += `Ville : ${document.getElementById("ville").value}\n`;
  message += `Adresse : ${document.getElementById("adresse").value}`;

  const lien = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(message)}`;
  window.open(lien, "_blank");

  panier = [];
  afficherPanier();
  formCommande.reset();
  fermerTiroir();
});

// ===== Liens WhatsApp (bouton flottant + footer) =====
const lienGeneral = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent("Bonjour, j'ai une question.")}`;
document.getElementById("btn-whatsapp").href = lienGeneral;
document.getElementById("lien-contact").href = lienGeneral;

// ===== Démarrage =====
afficherArticles();
afficherPanier();