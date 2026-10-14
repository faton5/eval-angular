import { Injectable, signal } from '@angular/core';

export interface Tache {
  identifiant: string;
  titre: string;
  description: string;
  dateEcheance: string;
  terminee: boolean;
}

@Injectable({ providedIn: 'root' })
export class ServiceTaches {
  private cleStockage = 'tp-tasks-angular';
  taches = signal<Tache[]>(this.chargerTaches());

  private chargerTaches(): Tache[] {
    const texte = localStorage.getItem(this.cleStockage);

    if (texte) {
      return JSON.parse(texte);
    }

    return [];
  }

  private sauvegarderTaches(taches: Tache[]) {
    // On garde les tâches dans le signal et dans le navigateur.
    this.taches.set(taches);
    localStorage.setItem(this.cleStockage, JSON.stringify(taches));
  }

  ajouterTache(titre: string, description: string, dateEcheance: string) {
    const nouvelleTache: Tache = {
      identifiant: Date.now().toString(),
      titre: titre.trim(),
      description: description.trim(),
      dateEcheance: dateEcheance,
      terminee: false
    };

    const taches = [...this.taches()];
    taches.push(nouvelleTache);
    this.sauvegarderTaches(taches);
  }

  modifierTache(identifiant: string, titre: string, description: string, dateEcheance: string) {
    const taches = [...this.taches()];

    for (const tache of taches) {
      if (tache.identifiant === identifiant) {
        tache.titre = titre.trim();
        tache.description = description.trim();
        tache.dateEcheance = dateEcheance;
      }
    }

    this.sauvegarderTaches(taches);
  }

  basculerTache(identifiant: string) {
    const taches = [...this.taches()];

    for (const tache of taches) {
      if (tache.identifiant === identifiant) {
        tache.terminee = !tache.terminee;
      }
    }

    this.sauvegarderTaches(taches);
  }

  supprimerTache(identifiant: string) {
    const nouvellesTaches: Tache[] = [];

    for (const tache of this.taches()) {
      if (tache.identifiant !== identifiant) {
        nouvellesTaches.push(tache);
      }
    }

    this.sauvegarderTaches(nouvellesTaches);
  }
}
