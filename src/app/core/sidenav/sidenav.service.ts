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
      description: 'Tasks that has been recently created.'
    },
    {
      name: 'today',
      isSelected: true,
      position: 'top',
      page: '/today',
      description: 'Tasks for today to work on.'
    },
    {
      name: 'upcoming',
      isSelected: false,
      position: 'top',
      page: '/upcoming',
      description: 'Tasks for the next day and so on.'
    },
    // {
    //   name: 'watching',
    //   isSelected: false,
    //   position: 'top',
    //   page: '/watching',
    //   description: 'Tasks that are on your watch for monitoring.'
    // },
    {
      name: 'high priority',
      isSelected: false,
      position: 'top',
      page: '/priority',
      description: 'Tasks that are high priority that needed to be done ASAP.'
    },
    {
      name: 'all list',
      isSelected: false,
      position: 'top',
      page: '/list',
      description: 'Tasks that are all listed regardless of the status.'
    },
    {
      name: 'completed',
      isSelected: false,
      position: 'top',
      page: '/completed',
      description: 'Tasks that are completed.'
    },
    {
      name: 'archive',
      isSelected: false,
      position: 'top',
      page: '/archive',
      description: 'Tasks that are requested for deletion.'
    },
    {
      name: 'calendar',
      isSelected: false,
      position: 'bottom',
      page: '/calendar',
      description: 'A viewable calendar for the tasks.'
    },
    {
      name: 'home',
      isSelected: false,
      position: 'bottom',
      page: '/home',
      description: 'Home page where is the default page.'
    },
  ];

  constructor() { }

}
