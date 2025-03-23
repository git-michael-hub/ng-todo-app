import { Routes } from '@angular/router';



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
        loadComponent: () => import('./features/task/pages/recent/recent.component').then(c => c.RecentComponent)
      },
      {
        path: 'today',
        title: 'Todays tasks',
        loadComponent: () => import('./features/task/pages/today/today.component').then(c => c.TodayComponent)
      },
      {
        path: 'upcoming',
        title: 'Upcoming tasks',
        loadComponent: () => import('./features/task/pages/upcoming/upcoming.component').then(c => c.UpcomingComponent)
      },
      {
        path: 'priority',
        title: 'Priority tasks',
        loadComponent: () => import('./features/task/pages/priority/priority.component').then(c => c.PriorityComponent)
      },
      {
        path: 'list',
        title: 'List of all tasks',
        loadComponent: () => import('./features/task/pages/list/list.component').then(c => c.ListComponent)
      },
      {
        path: 'completed',
        title: 'Completed tasks',
        loadComponent: () => import('./features/task/pages/completed/completed.component').then(c => c.CompletedComponent)
      },
      // {
      //   path: 'archive',
      //   title: 'Archive tasks',
      //   loadComponent: () => import('./features/task/pages/archive/archive.component').then(c => c.ArchiveComponent)
      // },
      {
        path: 'calendar',
        title: 'Calendar tasks',
        loadComponent: () => import('./features/task/pages/calendar/calendar.component').then(c => c.CalendarComponent)
      },
      {
        path: 'home',
        title: 'Home tasks',
        loadComponent: () => import('./features/task/pages/home/home.component').then(c => c.HomeComponent)
      },
    ]
  },
  {
    path: '**', redirectTo: '/home', pathMatch: 'full'
  }
];
