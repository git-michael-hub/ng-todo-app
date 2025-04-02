/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { signal } from '@angular/core';
import { STORE_TOKEN } from '../../../../data-access/state/state.store';
import { TaskService } from '../../task.service';
import { SidenavService } from '../../../../core/sidenav/sidenav.service';
import { CompletedComponent } from './completed.component';

describe('CompletedComponent', () => {
  let component: CompletedComponent;
  let fixture: ComponentFixture<CompletedComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockSidenavService: jasmine.SpyObj<SidenavService>;
  let mockStore: any;

  beforeEach(waitForAsync(() => {
    // Create mock services
    mockTaskService = jasmine.createSpyObj('TaskService', ['toSearch']);
    mockSidenavService = jasmine.createSpyObj('SidenavService', [], {
      navigations: [{
        id: 'completed',
        name: 'Completed',
        description: 'Completed Tasks',
        page: '/completed'
      }]
    });

    // Create mock store with all required signals
    mockStore = {
      task: {
        filter: {
          status: signal('complete'),
          listComputed: signal([])
        },
        search: {
          term: signal('')
        }
      }
    };

    TestBed.configureTestingModule({
      imports: [CompletedComponent],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: SidenavService, useValue: mockSidenavService },
        { provide: STORE_TOKEN, useValue: signal(mockStore) }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
