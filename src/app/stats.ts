import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ServiceTaches } from './task.service';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './stats.html'
})
export class Statistiques {
  constructor(public serviceTaches: ServiceTaches) {}

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
