import { Route, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SidenavService } from './core/sidenav/sidenav.service';
import { TMenu } from './core/sidenav/sidenav.model';

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
        loadComponent: () => import('./pages/recent/recent.component').then(c => c.RecentComponent)
      },
      {
        path: 'today',
        title: 'Todays tasks',
        loadComponent: () => import('./pages/today/today.component').then(c => c.TodayComponent)
      },
      {
        path: 'upcoming',
        title: 'Upcoming tasks',
        loadComponent: () => import('./pages/upcoming/upcoming.component').then(c => c.UpcomingComponent)
      },
      {
        path: 'priority',
        title: 'Priority tasks',
        loadComponent: () => import('./pages/priority/priority.component').then(c => c.PriorityComponent)
      },
      {
        path: 'list',
        title: 'List of all tasks',
        loadComponent: () => import('./pages/list/list.component').then(c => c.ListComponent)
      },
      {
        path: 'completed',
        title: 'Completed tasks',
        loadComponent: () => import('./pages/completed/completed.component').then(c => c.CompletedComponent)
      },
      {
        path: 'archive',
        title: 'Archive tasks',
        loadComponent: () => import('./pages/archive/archive.component').then(c => c.ArchiveComponent)
      },
      {
        path: 'calendar',
        title: 'Calendar tasks',
        loadComponent: () => import('./pages/calendar/calendar.component').then(c => c.CalendarComponent)
      },
      {
        path: 'home',
        title: 'Home tasks',
        loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent)
      },
    ]
  },
  {
    path: '**', redirectTo: '/home', pathMatch: 'full'
  }
];
