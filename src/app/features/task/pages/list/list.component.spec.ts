import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { TaskService } from '../../task.service';
import { SidenavService } from '../../../../core/sidenav/sidenav.service';
import { STORE_TOKEN } from '../../../../data-access/state/state.store';
import { signal } from '@angular/core';
import { TTask } from '../../../../utils/models/task.model';


describe('# ListComponent - Page', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockSidenavService: jasmine.SpyObj<SidenavService>;
  let mockStore: any;

  const mockTask: TTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    date: new Date().toISOString(),
    priority: 'high',
    isCompleted: false,
    isArchive: false
  };

  const mockTasks = [mockTask];

  beforeEach(async () => {
    // Create mock services
    mockTaskService = jasmine.createSpyObj('TaskService', ['toSearch']);
    mockSidenavService = jasmine.createSpyObj('SidenavService', [], {
      navigations: [{
        id: 'list',
        name: 'List',
        description: 'Task List',
        page: '/list'
      }]
    });

    // Create mock store
    mockStore = {
      task: {
        sort: {
          status: signal('asc'),
          listComputed: signal(mockTasks)
        },
        search: {
          term: signal(''),
          page: signal('list')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: SidenavService, useValue: mockSidenavService },
        { provide: STORE_TOKEN, useValue: signal(mockStore) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Happy Path', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
    describe('Unit Tests', () => {
      describe('Initialization', () => {
        it('should initialize with correct page information', () => {
          expect(component.PAGE.id).toBe('list');
          expect(component.PAGE.name).toBe('List');
          expect(component.PAGE.description).toBe('Task List');
        });

        it('should initialize tasks signal with sorted list', () => {
          expect(component.tasks()).toEqual(mockTasks);
        });

        it('should set initial sort status to asc', () => {
          expect(mockStore.task.sort.status()).toBe('asc');
        });
      });

      describe('Search Functionality', () => {
        it('should call taskService.toSearch when searching', () => {
          const searchTerm = 'test';
          mockTaskService.toSearch.and.returnValue(signal(mockTasks));

          component.toSearch(searchTerm);

          expect(mockTaskService.toSearch).toHaveBeenCalledWith(
            searchTerm,
            'list',
            mockStore.task.sort.listComputed
          );
        });

        it('should reset search and restore original list when closing search', () => {
          component.isSearch.set(true);
          component.toSearch('test');

          component.closeSearch();

          expect(component.isSearch()).toBeFalse();
          expect(mockStore.task.search.term()).toBe('');
          expect(component.tasks()).toEqual(mockStore.task.sort.listComputed());
        });
      });
    });

    describe('Integration Tests', () => {
      describe('Search Functionality', () => {
        it('should toggle search mode', () => {
          expect(component.isSearch()).toBeFalse();
          component.isSearch.set(true);
          expect(component.isSearch()).toBeTrue();
          component.closeSearch();
          expect(component.isSearch()).toBeFalse();
        });

        it('should update tasks when search results change', () => {
          const searchResults = [{ ...mockTask, title: 'Search Result' }];
          mockTaskService.toSearch.and.returnValue(signal(searchResults));

          component.toSearch('test');

          expect(component.tasks()).toEqual(searchResults);
        });

        it('should maintain sort order after search', () => {
          const searchResults = [{ ...mockTask, title: 'Search Result' }];
          mockTaskService.toSearch.and.returnValue(signal(searchResults));

          component.toSearch('test');

          expect(mockStore.task.sort.status()).toBe('asc');
        });
      });
    });
  });

  describe('Edge Cases', () => {
    describe('Unit Tests', () => {
      it('should handle empty task list', async () => {
        // Create a new signal with empty array
        const emptyListSignal = signal<TTask[]>([]);

        // Update the mock store's listComputed signal before component initialization
        mockStore.task.sort.listComputed = emptyListSignal;

        // Recreate the component with empty list
        fixture = TestBed.createComponent(ListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        // Verify the component's tasks signal is empty
        expect(component.tasks()).toEqual([]);
      });
    });

    describe('Integration Tests', () => {
      describe('Search Functionality', () => {
        it('should handle null search term', () => {
          component.toSearch('');
          expect(mockTaskService.toSearch).toHaveBeenCalledWith(
            '',
            'list',
            mockStore.task.sort.listComputed
          );
        });

        it('should handle special characters in search', () => {
          const specialSearch = '@#$%^&*()';
          mockTaskService.toSearch.and.returnValue(signal(mockTasks));

          component.toSearch(specialSearch);

          expect(mockTaskService.toSearch).toHaveBeenCalledWith(
            specialSearch,
            'list',
            mockStore.task.sort.listComputed
          );
        });

        it('should handle undefined search term', () => {
          component.toSearch(undefined as unknown as string);
          expect(mockTaskService.toSearch).toHaveBeenCalledWith(
            undefined as unknown as string,
            'list',
            mockStore.task.sort.listComputed
          );
        });

        it('should handle multiple search toggles', () => {
          component.isSearch.set(true);
          component.isSearch.set(false);
          component.isSearch.set(true);
          component.isSearch.set(false);
          expect(component.isSearch()).toBeFalse();
        });

        it('should handle search with whitespace', () => {
          const searchWithWhitespace = '   test   ';
          mockTaskService.toSearch.and.returnValue(signal(mockTasks));

          component.toSearch(searchWithWhitespace);

          expect(mockTaskService.toSearch).toHaveBeenCalledWith(
            searchWithWhitespace,
            'list',
            mockStore.task.sort.listComputed
          );
        });
      });
    });
  });
});
