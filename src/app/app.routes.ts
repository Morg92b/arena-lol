import { Routes } from '@angular/router';
import { ChampionList } from './components/champion-list/champion-list';

export const routes: Routes = [
  { path: '', component: ChampionList },
  { path: 'champions', component: ChampionList }
];
