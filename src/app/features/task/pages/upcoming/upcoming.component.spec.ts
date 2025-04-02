import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { signal } from '@angular/core';
import { STORE_TOKEN } from '../../../../data-access/state/state.store';
import { TaskService } from '../../task.service';
import { SidenavService } from '../../../../core/sidenav/sidenav.service';
import { UpcomingComponent } from './upcoming.component';

describe('UpcomingComponent', () => {
  let component: UpcomingComponent;
  let fixture: ComponentFixture<UpcomingComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockSidenavService: jasmine.SpyObj<SidenavService>;
  let mockStore: any;

  beforeEach(waitForAsync(() => {
    // Create mock services
    mockTaskService = jasmine.createSpyObj('TaskService', ['toSearch']);
    mockSidenavService = jasmine.createSpyObj('SidenavService', [], {
      navigations: [{
        id: 'upcoming',
        name: 'Upcoming',
        description: 'Upcoming Tasks',
        page: '/upcoming'
      }]
    });

    // Create mock store with all required signals
    mockStore = {
      task: {
        filter: {
          status: signal('upcoming'),
          listComputed: signal([]),
          highPriorityListComputed: signal([])
        },
        search: {
          term: signal('')
        },
        count: {
          highPriorityListComputed: signal(0),
          completeListComputed: signal(0),
          todoListComputed: signal(0),
          allListComputed: signal(0)
        }
      }
    };

    TestBed.configureTestingModule({
      imports: [UpcomingComponent],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: SidenavService, useValue: mockSidenavService },
        { provide: STORE_TOKEN, useValue: signal(mockStore) }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
