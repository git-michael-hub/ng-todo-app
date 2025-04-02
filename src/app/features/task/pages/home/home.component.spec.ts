/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { signal } from '@angular/core';
import { STORE_TOKEN } from '../../../../data-access/state/state.store';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockStore: any;

  beforeEach(waitForAsync(() => {
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
      imports: [HomeComponent],
      providers: [
        { provide: STORE_TOKEN, useValue: signal(mockStore) }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
