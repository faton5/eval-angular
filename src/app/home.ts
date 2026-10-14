import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceTaches, Tache } from './task.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.html'
})
export class Accueil {
  titre = '';
  description = '';
  dateEcheance = '';
  recherche = '';
  filtre = 'afaire';
  idEnModification = '';

  erreurTitre = '';
  erreurDate = '';

  constructor(public serviceTaches: ServiceTaches) {}

  dateDuJour(): string {
    const date = new Date();
    const mois = String(date.getMonth() + 1).padStart(2, '0');
    const jour = String(date.getDate()).padStart(2, '0');

    return `${date.getFullYear()}-${mois}-${jour}`;
  }



  valider(titre: string, dateEcheance: string): boolean {
    this.erreurTitre = '';
    this.erreurDate = '';

    if (titre.trim().length < 3) {
      this.erreurTitre = 'Le titre doit contenir au moins 3 caractères.';
    }

    if (dateEcheance !== '' && dateEcheance < this.dateDuJour()) {
      this.erreurDate = "L'échéance ne peut pas être passée.";
    }

    if (this.erreurTitre !== '' || this.erreurDate !== '') {
      return false;
    }

    return true;
  }

  ajouter() {
    const formulaireValide = this.valider(this.titre, this.dateEcheance);

    if (formulaireValide === false) {
      return;
    }

    this.serviceTaches.ajouterTache(
      this.titre,
      this.description,
      this.dateEcheance
    );

    this.titre = '';
    this.description = '';
    this.dateEcheance = '';
  }

  afficherTaches(): Tache[] {
    // Cette liste contient les tâches après la recherche et le filtre.
    const toutesLesTaches = this.serviceTaches.taches();
    const tachesAffichees: Tache[] = [];
    const texteRecherche = this.recherche.toLowerCase().trim();

    for (const tache of toutesLesTaches) {
      let afficher = true;

      if (this.filtre === 'afaire' && tache.terminee === true) {
        afficher = false;
      }

      if (this.filtre === 'terminees' && tache.terminee === false) {
        afficher = false;
      }

      const titreCorrespond = tache.titre.toLowerCase().includes(texteRecherche);
      const descriptionCorrespond = tache.description.toLowerCase().includes(texteRecherche);

      if (texteRecherche !== '' && titreCorrespond === false && descriptionCorrespond === false) {
        afficher = false;
      }

      if (afficher === true) {
        tachesAffichees.push(tache);
      }
    }

    tachesAffichees.sort((tacheA, tacheB) => {
      const dateA = tacheA.dateEcheance || '9999-12-31';
      const dateB = tacheB.dateEcheance || '9999-12-31';

      if (dateA < dateB) {
        return -1;
      }

      if (dateA > dateB) {
        return 1;
      }

      return tacheA.titre.localeCompare(tacheB.titre);
    });

    return tachesAffichees;
  }

  commencerModification(tache: Tache) {
    this.idEnModification = tache.identifiant;
  }

  enregistrer(tache: Tache) {
    const tacheValide = this.valider(tache.titre, tache.dateEcheance);

    if (tacheValide === false) {
      return;
    }

    this.serviceTaches.modifierTache(
      tache.identifiant,
      tache.titre,
      tache.description,
      tache.dateEcheance
    );

    this.idEnModification = '';
  }

  supprimer(tache: Tache) {
    const confirmation = confirm('Supprimer cette tâche ?');

    if (confirmation === true) {
      this.serviceTaches.supprimerTache(tache.identifiant);
    }
  }

  terminer(tache: Tache) {
    this.serviceTaches.basculerTache(tache.identifiant);
  }

  compterAFaire(): number {
    let nombre = 0;

    for (const tache of this.serviceTaches.taches()) {
      if (tache.terminee === false) {
        nombre++;
      }
    }

    return nombre;
  }

  compterTerminees(): number {
    let nombre = 0;

    for (const tache of this.serviceTaches.taches()) {
      if (tache.terminee === true) {
        nombre++;
      }
    }

    return nombre;
  }
}
