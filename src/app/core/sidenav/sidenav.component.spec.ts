/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { signal } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { STORE_TOKEN } from '../../data-access/state/state.store';
import { TaskService } from '../../features/task/task.service';
import { SidenavService } from './sidenav.service';
import { SidenavComponent } from './sidenav.component';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockSidenavService: jasmine.SpyObj<SidenavService>;
  let mockMediaMatcher: jasmine.SpyObj<MediaMatcher>;
  let mockStore: any;

  beforeEach(waitForAsync(() => {
    // Create mock services
    mockTaskService = jasmine.createSpyObj('TaskService', ['toSearch']);
    mockSidenavService = jasmine.createSpyObj('SidenavService', [], {
      navigations: [{
        id: 'home',
        name: 'Home',
        description: 'Home Page',
        page: '/'
      }]
    });

    // Create mock MediaMatcher
    const mockMediaQueryList = {
      matches: false,
      media: '',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true
    };

    mockMediaMatcher = jasmine.createSpyObj('MediaMatcher', ['matchMedia']);
    mockMediaMatcher.matchMedia.and.returnValue(mockMediaQueryList);

    // Create mock store with all required signals
    mockStore = {
      task: {
        filter: {
          status: signal('all'),
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
      imports: [SidenavComponent],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: SidenavService, useValue: mockSidenavService },
        { provide: MediaMatcher, useValue: mockMediaMatcher },
        { provide: STORE_TOKEN, useValue: signal(mockStore) }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
