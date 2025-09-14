import { Routes } from '@angular/router';
import { VerifyEmailComponent } from './features/authentication/verify-email/verify-email.component';


export const ROUTES: Routes = [
  {
    path: '', redirectTo: '/home', pathMatch: 'full'
  },
  {
    path: '',
    children: [
      {
        path: 'recent',
        title: 'Recent tasks',
        loadComponent: () => import('./features/task/pages/list/list.component')
          .then(c => c.TaskBaseListComponent)
      },
      {
        path: 'today',
        title: 'Todays tasks',
        loadComponent: () => import('./features/task/pages/list/list.component')
          .then(c => c.TaskBaseListComponent)
      },
      {
        path: 'upcoming',
        title: 'Upcoming tasks',
        loadComponent: () => import('./features/task/pages/list/list.component')
          .then(c => c.TaskBaseListComponent)
      },
      {
        path: 'priority',
        title: 'Priority tasks',
        loadComponent: () => import('./features/task/pages/list/list.component')
          .then(c => c.TaskBaseListComponent)
      },
      {
        path: 'list',
        title: 'List of all tasks',
        loadComponent: () => import('./features/task/pages/list/list.component')
          .then(c => c.TaskBaseListComponent)
      },
      {
        path: 'completed',
        title: 'Completed tasks',
        loadComponent: () => import('./features/task/pages/list/list.component')
          .then(c => c.TaskBaseListComponent)
      },
      // {
      //   path: 'archive',
      //   title: 'Archive tasks',
      //   loadComponent: () => import('./features/task/pages/archive/archive.component').then(c => c.ArchiveComponent)
      // },
      {
        path: 'calendar',
        title: 'Calendar tasks',
        loadComponent: () => import('./features/task/pages/calendar/calendar.component')
          .then(c => c.CalendarComponent)
      },
      {
        path: 'home',
        title: 'Home tasks',
        loadComponent: () => import('./features/task/pages/home/home.component')
          .then(c => c.HomeComponent)
      },

    ]
  },
  {
    path: 'verify-email/:token',
    component: VerifyEmailComponent
  },
  {
    path: '**', redirectTo: '/home', pathMatch: 'full'
  }
];
