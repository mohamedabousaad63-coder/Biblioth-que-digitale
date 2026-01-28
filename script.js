// ---------- Initialisation ----------
let estAdmin = false;
let livreEnCours = null;

let livres = JSON.parse(localStorage.getItem("livres")) || [
  {id:1,titre:"Livre 1",emprunte:false},
  {id:2,titre:"Livre 2",emprunte:false},
  {id:3,titre:"Livre 3",emprunte:false},
  {id:4,titre:"Livre 4",emprunte:false},
  {id:5,titre:"Livre 5",emprunte:false},
  {id:6,titre:"Livre 6",emprunte:false}
];
localStorage.setItem("livres", JSON.stringify(livres));

// ---------- Livres ----------
function afficherLivres() {
  const div = document.getElementById("listeLivres");
  if(!div) return;
  livres = JSON.parse(localStorage.getItem("livres"));
  div.innerHTML = "";
  livres.forEach(l => {
    div.innerHTML += `
    <div class="book">
      <strong>${l.titre}</strong><br>
      <button onclick="emprunterLivre(${l.id})" ${l.emprunte ? "disabled" : ""}>${l.emprunte ? "📕 Emprunté" : "Emprunter"}</button>
      <button onclick="ajouterFavori(${l.id})">❤️ Favori</button>
      <button onclick="supprimerLivre(${l.id})" style="color:red">Supprimer</button>
    </div>`;
  });
}

function emprunterLivre(id){
  livreEnCours = id;
  document.getElementById("empruntForm").style.display = "flex";
}

function fermerEmpruntForm(){
  document.getElementById("empruntForm").style.display = "none";
  livreEnCours = null;
}

function confirmerEmprunt(){
  const nom = document.getElementById("nomEmprunt").value.trim();
  const prenom = document.getElementById("prenomEmprunt").value.trim();
  const groupe = document.getElementById("groupeEmprunt").value.trim();
  if(!nom || !prenom || !groupe){ alert("Veuillez remplir tous les champs !"); return; }
  livres = JSON.parse(localStorage.getItem("livres"));
  livres.forEach(l=>{
    if(l.id===livreEnCours){
      l.emprunte=true; 
      l.nom=nom; 
      l.prenom=prenom; 
      l.groupe=groupe;
    }
  });
  localStorage.setItem("livres", JSON.stringify(livres));
  enregistrerHistorique(livreEnCours);
  afficherLivres();
  fermerEmpruntForm();
}

// ---------- Favoris ----------
function ajouterFavori(id){
  let favoris = JSON.parse(localStorage.getItem("favoris")) || [];
  const livre = livres.find(l=>l.id===id);
  if(!favoris.some(f=>f.id===id)){
    favoris.push(livre); 
    localStorage.setItem("favoris", JSON.stringify(favoris)); 
    alert("✅ Livre ajouté aux favoris !");
  }
}

function supprimerFavori(id){
  let favoris = JSON.parse(localStorage.getItem("favoris")) || [];
  favoris = favoris.filter(f=>f.id!==id);
  localStorage.setItem("favoris", JSON.stringify(favoris));
  afficherFavoris();
}

function afficherFavoris(){
  const div = document.getElementById("listeFavoris");
  if(!div) return;
  let favoris = JSON.parse(localStorage.getItem("favoris")) || [];
  div.innerHTML="";
  favoris.forEach(l=>{
    div.innerHTML += `<div class="book">❤️ <strong>${l.titre}</strong><br><button onclick="supprimerFavori(${l.id})" style="color:red">Supprimer</button></div>`;
  });
}

// ---------- Historique ----------
function enregistrerHistorique(id){
  let historique = JSON.parse(localStorage.getItem("historique")) || [];
  const livre = livres.find(l=>l.id===id);
  historique.push({titre:livre.titre, nom:livre.nom, prenom:livre.prenom, groupe:livre.groupe, date:new Date().toLocaleString()});
  localStorage.setItem("historique", JSON.stringify(historique));
}

function afficherHistorique(){
  const div = document.getElementById("listeHistorique");
  if(!div) return;
  let historique = JSON.parse(localStorage.getItem("historique")) || [];
  div.innerHTML="";
  historique.forEach(h=>{
    div.innerHTML += `<p>📖 ${h.titre} - ${h.nom} ${h.prenom} (${h.groupe}) - ${h.date}</p>`;
  });
}

// ---------- Nouveautés ----------
function afficherNouveautes(){
  const div = document.getElementById("listeNouveautes");
  if(!div) return;
  livres = JSON.parse(localStorage.getItem("livres"));
  div.innerHTML="";
  livres.slice(-3).forEach(l=>{
    div.innerHTML += `<div class="book">${l.titre}</div>`;
  });
}

// ---------- Réservation des places ----------
let places = JSON.parse(localStorage.getItem("places")) || [
  {id:1, nom:"", prenom:"", groupe:"", heure:"", reserve:false},
  {id:2, nom:"", prenom:"", groupe:"", heure:"", reserve:false},
  {id:3, nom:"", prenom:"", groupe:"", heure:"", reserve:false},
  {id:4, nom:"", prenom:"", groupe:"", heure:"", reserve:false},
  {id:5, nom:"", prenom:"", groupe:"", heure:"", reserve:false}
];

function afficherPlaces(){
  const div = document.getElementById("listePlaces");
  if(!div) return;
  div.innerHTML = "";
  places.forEach(p=>{
    div.innerHTML += `<p>Place ${p.id} - ${p.reserve ? "🔒 Réservée par " + p.nom : "Libre"}</p>`;
  });
  const nb = document.getElementById("nombreReservations");
  if(nb) nb.textContent = places.filter(p=>p.reserve).length;
}

function reserverPlace(){
  const nom = document.getElementById("nomPlace").value.trim();
  const prenom = document.getElementById("prenomPlace").value.trim();
  const groupe = document.getElementById("groupePlace").value.trim();
  const placeId = parseInt(document.getElementById("place").value);
  const heure = document.getElementById("heure").value;
  if(!nom || !prenom || !groupe || !placeId || !heure){ alert("Veuillez remplir tous les champs"); return; }

  const place = places.find(p=>p.id===placeId);
  if(place.reserve){ alert("Cette place est déjà réservée"); return; }

  place.nom=nom; place.prenom=prenom; place.groupe=groupe; place.heure=heure; place.reserve=true;
  localStorage.setItem("places", JSON.stringify(places));
  afficherPlaces();

  setTimeout(()=>{
    place.nom=""; place.prenom=""; place.groupe=""; place.heure=""; place.reserve=false;
    localStorage.setItem("places", JSON.stringify(places));
    afficherPlaces();
  }, 2.5*60*60*1000);
}

// ---------- Admin ----------
function connexionAdmin(){
  const pwd = document.getElementById("passwordAdmin").value;
  if(pwd==="admin123"){ estAdmin=true; document.getElementById("etatAdmin").textContent="✅ Connecté en admin"; } 
  else { alert("Mot de passe incorrect"); }
}

// ---------- Contact ----------
function envoyerMessage(){
  const nom = document.getElementById("nomContact").value.trim();
  const email = document.getElementById("emailContact").value.trim();
  const message = document.getElementById("messageContact").value.trim();
  if(!nom || !email || !message){ alert("Veuillez remplir tous les champs"); return; }
  document.getElementById("etatContact").textContent = `✅ Merci ${nom}, votre message a été envoyé !`;
  document.getElementById("contactForm").reset();
}