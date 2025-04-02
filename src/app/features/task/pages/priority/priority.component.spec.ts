/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { signal } from '@angular/core';
import { STORE_TOKEN } from '../../../../data-access/state/state.store';
import { TaskService } from '../../task.service';
import { SidenavService } from '../../../../core/sidenav/sidenav.service';
import { PriorityComponent } from './priority.component';

describe('PriorityComponent', () => {
  let component: PriorityComponent;
  let fixture: ComponentFixture<PriorityComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockSidenavService: jasmine.SpyObj<SidenavService>;
  let mockStore: any;

  beforeEach(waitForAsync(() => {
    // Create mock services
    mockTaskService = jasmine.createSpyObj('TaskService', ['toSearch']);
    mockSidenavService = jasmine.createSpyObj('SidenavService', [], {
      navigations: [{
        id: 'priority',
        name: 'Priority',
        description: 'Priority Tasks',
        page: '/priority'
      }]
    });

    // Create mock store with all required signals
    mockStore = {
      task: {
        filter: {
          status: signal('priority'),
          listComputed: signal([])
        },
        search: {
          term: signal('')
        }
      }
    };

    TestBed.configureTestingModule({
      imports: [PriorityComponent],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: SidenavService, useValue: mockSidenavService },
        { provide: STORE_TOKEN, useValue: signal(mockStore) }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
