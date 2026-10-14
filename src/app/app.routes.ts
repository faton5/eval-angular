import { Routes } from '@angular/router';
import { Accueil } from './home';
import { Statistiques } from './stats';

export const routes: Routes = [
  { path: '', component: Accueil },
  { path: 'stats', component: Statistiques },
  { path: '**', redirectTo: '' }
];
