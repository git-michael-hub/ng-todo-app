import { Injectable } from '@angular/core';
import { TMenu } from './sidenav.model';
import { RecentComponent } from '../../pages/recent/recent.component';
import { TodayComponent } from '../../pages/today/today.component';
import { UpcomingComponent } from '../../pages/upcoming/upcoming.component';
import { PriorityComponent } from '../../pages/priority/priority.component';
import { ListComponent } from '../../pages/list/list.component';
import { CompletedComponent } from '../../pages/completed/completed.component';
import { ArchiveComponent } from '../../pages/archive/archive.component';
import { CalendarComponent } from '../../pages/calendar/calendar.component';
import { HomeComponent } from '../../pages/home/home.component';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  navigations: TMenu[] = [
    {
      name: 'recently added',
      isSelected: false,
      position: 'top',
      page: '/recent',
    },
    {
      name: 'today',
      isSelected: true,
      position: 'top',
      page: '/today',
    },
    {
      name: 'upcoming',
      isSelected: false,
      position: 'top',
      page: '/upcoming',
    },
    {
      name: 'priority',
      isSelected: false,
      position: 'top',
      page: '/priority',
    },
    {
      name: 'all list',
      isSelected: false,
      position: 'top',
      page: '/list',
    },
    {
      name: 'completed',
      isSelected: false,
      position: 'top',
      page: '/completed',
    },
    {
      name: 'archive',
      isSelected: false,
      position: 'top',
      page: '/archive',
    },
    {
      name: 'calendar',
      isSelected: false,
      position: 'bottom',
      page: '/calendar',
    },
    {
      name: 'home',
      isSelected: false,
      position: 'bottom',
      page: '/home',
    },
  ];

  constructor() { }

}
