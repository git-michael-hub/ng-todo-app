import { Injectable } from '@angular/core';
import { TMenu } from './sidenav.model';



@Injectable({
  providedIn: 'root'
})
export class SidenavService {

  navigations: TMenu[] = [
    {
      name: 'recently added',
      id: 'recently_added',
      isSelected: false,
      position: 'top',
      page: '/recent',
      description: 'Tasks that has been recently created.'
    },
    {
      name: 'today',
      id: 'today',
      isSelected: true,
      position: 'top',
      page: '/today',
      description: 'Tasks for today to work on.'
    },
    {
      name: 'upcoming',
      id: 'upcoming',
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
      id: 'high_priority',
      isSelected: false,
      position: 'top',
      page: '/priority',
      description: 'Tasks that are high priority that needed to be done ASAP.'
    },
    {
      name: 'all list',
      id: 'all_list',
      isSelected: false,
      position: 'top',
      page: '/list',
      description: 'Tasks that are all listed regardless of the status.'
    },
    {
      name: 'completed',
      id: 'completed',
      isSelected: false,
      position: 'top',
      page: '/completed',
      description: 'Tasks that are completed.'
    },
    // {
    //   name: 'archive',
    //   isSelected: false,
    //   position: 'top',
    //   page: '/archive',
    //   description: 'Tasks that are requested for deletion.'
    // },
    {
      name: 'calendar',
      id: 'calendar',
      isSelected: false,
      position: 'bottom',
      page: '/calendar',
      description: 'A viewable calendar for the tasks.'
    },
    {
      name: 'home',
      id: 'home',
      isSelected: false,
      position: 'bottom',
      page: '/home',
      description: 'Home page where is the default page.'
    },
  ];

}
