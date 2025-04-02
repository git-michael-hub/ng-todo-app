/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { signal } from '@angular/core';
import { STORE_TOKEN } from '../../../../data-access/state/state.store';
import { TaskService } from '../../task.service';
import { SidenavService } from '../../../../core/sidenav/sidenav.service';
import { RecentComponent } from './recent.component';

describe('RecentComponent', () => {
  let component: RecentComponent;
  let fixture: ComponentFixture<RecentComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockSidenavService: jasmine.SpyObj<SidenavService>;
  let mockStore: any;

  beforeEach(waitForAsync(() => {
    // Create mock services
    mockTaskService = jasmine.createSpyObj('TaskService', ['toSearch']);
    mockSidenavService = jasmine.createSpyObj('SidenavService', [], {
      navigations: [{
        id: 'recent',
        name: 'Recent',
        description: 'Recent Tasks',
        page: '/recent'
      }]
    });

    // Create mock store
    mockStore = {
      task: {
        sort: {
          status: signal('asc'),
          listComputed: signal([])
        },
        search: {
          term: signal(''),
          page: signal('recent')
        }
      }
    };

    TestBed.configureTestingModule({
      imports: [RecentComponent],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: SidenavService, useValue: mockSidenavService },
        { provide: STORE_TOKEN, useValue: signal(mockStore) }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
