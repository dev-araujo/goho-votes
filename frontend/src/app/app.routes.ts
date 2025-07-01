import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'sobre',
    loadComponent: () =>
      import('./features/about/about.component').then((a) => a.AboutComponent),
    title: 'Sobre',
  },
  {
    path: 'vote',
    loadComponent: () =>
      import('./features/open-voting/open-voting.component').then(
        (m) => m.OpenVotingComponent
      ),
    title: 'Vote!',
  },
  {
    path: 'votadas',
    loadComponent: () =>
      import('./features/closed-voting/closed-voting.component').then(
        (d) => d.ClosedVotingComponent
      ),
    title: 'Enquetes encerradas',
  },
  { path: '**', redirectTo: '/sobre', pathMatch: 'full' },
];
