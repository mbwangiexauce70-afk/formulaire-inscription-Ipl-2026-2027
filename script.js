

// script.js - IPL 2026 - Recommencé à zéro - CLASSES GARANTIES
document.addEventListener('DOMContentLoaded', function() {
  console.log("IPL - Script chargé - version zéro");

  const ADMIN_WHATSAPP = "243834209244"; // CHANGE ICI TON NUMERO IPL

  const filiere = document.getElementById('filiere');
  const classe = document.getElementById('classe');
  const feeInsc = document.getElementById('fee-insc');
  const ecoleInfo = document.getElementById('ecole-info');
  const form = document.getElementById('formIPL');
  const successBox = document.getElementById('successBox');

  // VERIFICATION
  if (!filiere) { alert("Erreur: filiere introuvable"); return; }
  if (!classe) { alert("Erreur: classe introuvable"); return; }

  // FONCTION PRINCIPALE - CLASSE QUI SORT
  function remplirClasses() {
    const valeur = filiere.value;
    console.log("Filière choisie:", valeur);

    // Vide
    classe.innerHTML = "";

    let classes = [];
    let frais = "--";

    if (valeur === "base") {
      classes = ["7ème A", "7ème B", "8ème A", "8ème B"];
      frais = "15$";
    } else if (valeur === "electronique") {
      classes = ["1ère Électronique", "2ème Électronique", "3ème Électronique", "4ème Électronique"];
      frais = "20$";
    } else if (valeur === "couture") {
      classes = ["1ère Coupe et Couture", "2ème Coupe et Couture", "3ème Coupe et Couture", "4ème Coupe et Couture"];
      frais = "20$";
    } else if (valeur === "pedagogie") {
      classes = ["1ère Pédagogie Générale", "2ème Pédagogie", "3ème Pédagogie", "4ème Pédagogie"];
      frais = "20$";
    }

    if (classes.length === 0) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "Choisis d'abord la filière";
      classe.appendChild(opt);
      if (feeInsc) feeInsc.textContent = "--";
    } else {
      classes.forEach(function(nomClasse) {
        const opt = document.createElement("option");
        opt.value = nomClasse;
        opt.textContent = nomClasse;
        classe.appendChild(opt);
      });
      if (feeInsc) feeInsc.textContent = frais;
    }
  }

  // Ecoute le changement
  filiere.addEventListener('change', remplirClasses);

  // Paiement
  const radios = document.querySelectorAll('input[name="paiement"]');
  radios.forEach(function(r) {
    r.addEventListener('change', function() {
      if (this.value === "ecole") {
        ecoleInfo.classList.remove('hidden');
      } else {
        ecoleInfo.classList.add('hidden');
      }
    });
  });

  // Soumission
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();

      const nom = document.getElementById('nom').value.trim();
      const postnom = document.getElementById('postnom').value.trim();
      const naissance = document.getElementById('naissance').value;
      const sexe = document.getElementById('sexe').value;
      const fil = document.getElementById('filiere').value;
      const cla = document.getElementById('classe').value;
      const parent = document.getElementById('parent').value.trim();
      const whatsapp = document.getElementById('whatsapp').value.trim();
      const adresse = document.getElementById('adresse').value.trim();
      const paiement = document.querySelector('input[name="paiement"]:checked');
      const engagement = document.getElementById('engagement').checked;

      if (!nom || !postnom || !naissance || !sexe || !fil || !cla || !parent || !whatsapp || !adresse) {
        alert("Remplis tous les champs avec *");
        return;
      }
      if (!paiement) { alert("Choisis le mode de paiement"); return; }
      if (!engagement) { alert("Coche l'engagement 72h"); return; }

      const btn = document.getElementById('btnSubmit');
      btn.disabled = true;
      btn.textContent = "Enregistrement...";

      setTimeout(function() {
        const fraisAffiche = feeInsc ? feeInsc.textContent : "20$";
        const matricule = "IPL-2026-" + Math.random().toString(36).substring(2,6).toUpperCase() + Date.now().toString().slice(-3);

        document.getElementById('matricule').textContent = matricule;
        document.getElementById('successMsg').innerHTML = "L'élève <b>" + nom + " " + postnom + "</b> en <b>" + cla + "</b> est pré-inscrit.<br>Frais: <b>" + fraisAffiche + "</b> - Trimestre: <b>Voir le bureau</b>";
        document.getElementById('shareUrl').textContent = "Matricule: " + matricule;

        const msgEcole = "*NOUVELLE INSCRIPTION IPL LEMBA*%0A%0A*Matricule:* " + matricule + "%0A*Élève:* " + nom + " " + postnom + "%0A*Classe:* " + cla + " (" + fil + ")%0A*Parent:* " + parent + "%0A*WhatsApp:* " + whatsapp + "%0A*Adresse:* " + adresse + "%0A*Frais:* " + fraisAffiche + " + Trimestre Voir le bureau";
        document.getElementById('waEcole').href = "https://wa.me/" + ADMIN_WHATSAPP + "?text=" + msgEcole;

        const numParent = whatsapp.replace(/\s|\+/g, '');
        const msgParent = "Bonjour " + parent + ",%0AVotre enfant " + nom + " " + postnom + " est pré-inscrit à l'IPL Lemba en " + cla + ".%0A%0AMatricule: " + matricule + "%0AFrais: " + fraisAffiche + " - Trimestre: Voir le bureau%0A%0AMerci de passer au bureau dans les 72h avec dossier complet.";
        document.getElementById('waParent').href = "https://wa.me/" + numParent + "?text=" + msgParent;

        form.classList.add('hidden');
        successBox.classList.remove('hidden');
        window.scrollTo({top:0, behavior:'smooth'});

        const data = { nom, postnom, naissance, sexe, filiere: fil, classe: cla, parent, whatsapp, adresse, date: new Date().toISOString(), matricule };
        const list = JSON.parse(localStorage.getItem('ipl_inscriptions') || '[]');
        list.push(data);
        localStorage.setItem('ipl_inscriptions', JSON.stringify(list));

        btn.disabled = false;
        btn.textContent = "S'inscrire à l'IPL →";
      }, 600);
    });
  }
});

function copyLink() {
  const txt = document.getElementById('shareUrl').textContent;
  navigator.clipboard.writeText(txt).then(function(){ alert(txt); });
}
function resetForm() {
  document.getElementById('formIPL').reset();
  document.getElementById('formIPL').classList.remove('hidden');
  document.getElementById('successBox').classList.add('hidden');
  document.getElementById('classe').innerHTML = '<option value="">Choisis d\'abord la filière</option>';
  const fee = document.getElementById('fee-insc'); if(fee) fee.textContent = "--";
  const info = document.getElementById('ecole-info'); if(info) info.classList.add('hidden');
}