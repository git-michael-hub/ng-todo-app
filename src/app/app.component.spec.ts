import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { signal } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { STORE_TOKEN } from './data-access/state/state.store';
import { TaskService } from './features/task/task.service';
import { TaskAPI } from './data-access/apis/task.api';
import { AppComponent } from './app.component';
import { PLATFORM_ID } from '@angular/core';
import { SidenavService } from './core/sidenav/sidenav.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockTaskAPI: jasmine.SpyObj<TaskAPI>;
  let mockSidenavService: jasmine.SpyObj<SidenavService>;
  let mockStore: any;

  beforeEach(waitForAsync(() => {
    // Create mock services
    mockTaskService = jasmine.createSpyObj('TaskService', ['addTask', 'updateTask', 'deleteTask']);
    mockTaskAPI = jasmine.createSpyObj('TaskAPI', ['getTasks', 'addTask', 'updateTask', 'deleteTask']);
    mockSidenavService = jasmine.createSpyObj('SidenavService', [], {
      navigations: [{
        id: 'home',
        name: 'Home',
        description: 'Home Page',
        page: '/'
      }]
    });

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
      imports: [
        HttpClientModule,
        AppComponent
      ],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: TaskAPI, useValue: mockTaskAPI },
        { provide: SidenavService, useValue: mockSidenavService },
        { provide: STORE_TOKEN, useValue: signal(mockStore) },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const titleElement = fixture.debugElement.query(By.css('h1'));
    expect(titleElement.nativeElement.textContent).toContain('Workie-Work');
  });
});
