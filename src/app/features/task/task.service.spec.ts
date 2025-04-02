import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { TaskAPI } from '../../data-access/apis/task.api';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoggingService } from '../../utils/services/logging.service';
import { of, throwError } from 'rxjs';
import { TTask } from '../../utils/models/task.model';
import { TaskFormDialogComponent } from '../../uis/forms/task-form-dialog/task-form-dialog.component';
import { computed, signal } from '@angular/core';
import { IState } from '../../data-access/state/state.model';
import { STORE_TOKEN } from '../../data-access/state/state.store';

// Helper functions from state.store.ts
const IS_TODAY = (taskDate: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return taskDate.split('T')[0] === today;
}

const NOT_TODAY = (taskDate: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return taskDate.split('T')[0] !== today;
}

// Create a mock store function
const createMockStore = () => {
  // Create signals
  const listSignal = signal<TTask[]>([]);
  const addedSignal = signal<TTask | null>(null);
  const updatedSignal = signal<TTask | null>(null);
  const viewedSignal = signal<TTask | null>(null);
  const deletedSignal = signal<TTask | null>(null);

  // Add update method to list signal
  (listSignal as any).update = (updateFn: (tasks: TTask[]) => TTask[]) => {
    const currentTasks = listSignal();
    const updatedTasks = updateFn(currentTasks);
    listSignal.set(updatedTasks);
  };

  // Create the store
  const store: IState = {
    id: 'main_store',
    task: {
      list: listSignal,
      added: addedSignal,
      updated: updatedSignal,
      viewed: viewedSignal,
      deleted: deletedSignal,

      sort: {
        status: signal('asc'),
        listComputed: computed(() => {
          const ORDER = store.task.sort.status();
          const TASKS = store.task.list();

          return [...TASKS].sort((a, b) =>
            ORDER === 'asc'
              ? new Date(a.date).getTime() - new Date(b.date).getTime() // asc
              : new Date(b.date).getTime() - new Date(a.date).getTime() // desc
          );
        })
      },
      filter: {
        status: signal('today'),
        listComputed: computed(() => {
          const FILTER = store.task.filter.status();
          const TASKS = store.task.list();

          switch (FILTER) {
            case 'today': return [...TASKS].filter(task => IS_TODAY(task.date));
            case 'upcoming': {
              const withDateObject = TASKS.map(task => ({
                ...task,
                date: new Date(task.date)
              }));

              const today = new Date();

              let upcomingDates: any = withDateObject.filter(task => task.date >= today);
              upcomingDates = upcomingDates.map((task: { date: { toDateString: () => any; }; }) => ({
                ...task,
                date: task.date?.toDateString()
              }));

              return upcomingDates
                .sort((a: { date: string | number | Date; }, b: { date: string | number | Date; }) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()) as unknown as TTask[]; // desc
            }
            case 'high-priority': return [...TASKS].filter(task => task.priority === 'high');
            case 'complete': return [...TASKS].filter(task => task.isCompleted);
            case 'archive': return [...TASKS].filter(task => task.isArchive);
          }
        })
      },
      count: {
        allListComputed: computed(() => {
          const TASKS = store.task.list();
          return [...TASKS]?.length;
        }),
        completeListComputed: computed(() => {
          const TASKS = store.task.list();
          return [...TASKS].filter(task => task.isCompleted)?.length;
        }),
        todoListComputed: computed(() => {
          const TASKS = store.task.list();
          return [...TASKS].filter(task => !task.isCompleted)?.length;
        }),
        highPriorityListComputed: computed(() => {
          const TASKS = store.task.list();
          return [...TASKS].filter(task => task.priority === 'high')?.length;
        })
      },
      search: {
        page: signal('list'),
        term: signal(''),
        list: signal([]),
        filteredListByTitle: computed(() => {
          const TERM = store.task.search.term();
          const LIST = store.task.search.list();
          return LIST.filter(task => task.title.toLowerCase().includes(TERM.toLowerCase()));
        })
      },
      toString: () => ({
        list: store.task.list(),
        added: store.task.added(),
        updated: store.task.updated(),
        viewed: store.task.viewed(),
        deleted: store.task.deleted()
      })
    }
  };

  return store;
};

// Create a single instance of the mock store
const mockStore = createMockStore();

describe('# TaskService - Service', () => {
  let service: TaskService;
  let mockTaskAPI: jasmine.SpyObj<TaskAPI>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockLoggingService: jasmine.SpyObj<LoggingService>;

  const mockTask: TTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    date: new Date().toISOString(),
    priority: 'high',
    isCompleted: false,
    isArchive: false
  };

  const mockDialogRef = {
    afterClosed: jasmine.createSpy('afterClosed').and.returnValue(of('closed')),
    close: jasmine.createSpy('close'),
    componentInstance: {},
    disableClose: false,
    id: '1',
    addPanelClass: () => {},
    removePanelClass: () => {},
    backdropClick: () => of({}),
    beforeClosed: () => of({}),
    keydownEvents: () => of({}),
    updatePosition: () => {},
    updateSize: () => {},
    getState: () => 'open',
    _ref: {},
    _containerInstance: {},
    componentRef: {},
    _afterOpened: () => of({}),
    _beforeClosed: () => of({}),
    _afterClosed: () => of({}),
    _keydownEvents: () => of({}),
    _backdropClick: () => of({}),
    _getOverlayRef: () => ({})
  } as unknown as MatDialogRef<TaskFormDialogComponent>;

  beforeEach(() => {
    mockTaskAPI = jasmine.createSpyObj('TaskAPI', {
      getTasks: of([mockTask]),
      getTask: of(mockTask),
      addTask: of(mockTask),
      updateTask: of({ ...mockTask, title: 'Updated Task' }),
      deleteTask: of(mockTask)
    });

    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockLoggingService = jasmine.createSpyObj('LoggingService', ['recordData']);

    TestBed.configureTestingModule({
      providers: [
        TaskService,
        { provide: TaskAPI, useValue: mockTaskAPI },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: LoggingService, useValue: mockLoggingService },
        { provide: STORE_TOKEN, useValue: signal(mockStore) }
      ]
    });

    service = TestBed.inject(TaskService);
    (service as any).dialogRef = mockDialogRef;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Happy Path', () => {
    describe('Task List Operations', () => {
      it('should fetch and update task list', () => {
        // Set up initial state
        const taskList = [
          { ...mockTask, id: '1', title: 'Task 1' },
          { ...mockTask, id: '2', title: 'Task 2' }
        ];
        mockTaskAPI.getTasks.and.returnValue(of(taskList));

        // Act
        service.getTasks();

        // Assert
        expect(mockTaskAPI.getTasks).toHaveBeenCalledWith();
        expect(mockStore.task.list()).toEqual(taskList);
        expect(mockLoggingService.recordData).toHaveBeenCalledWith('getTask');
      });
    });

    describe('addTask', () => {
      it('should add task and update store', () => {
        // Set up initial state
        const initialTask = [{ ...mockTask, id: '1', title: 'Initial Task' }];
        const expectedTask = { ...mockTask, id: '2', title: 'New Task' };

        mockStore.task.list.set(initialTask); // Set initial state
        mockTaskAPI.addTask.and.returnValue(of(expectedTask)); // Mock API response

        // Act
        service.addTask(expectedTask);

        // Assert
        expect(mockTaskAPI.addTask).toHaveBeenCalledWith(expectedTask);
        expect(mockStore.task.list()).toEqual([...initialTask, expectedTask]);
        expect(mockStore.task.added()).toEqual(expectedTask);
        expect(mockLoggingService.recordData).toHaveBeenCalledWith('addTask');
      });
    });

    describe('updateTask', () => {
      it('should update task and update store', () => {
        // Set up initial state
        const callback = jasmine.createSpy('callback');
        const taskList = [
          { ...mockTask, id: '1', title: 'Task 1' },
          { ...mockTask, id: '2', title: 'Task 2' }
        ];
        const toUpdateTask = { ...mockTask, id: '1', title: 'Updated Task' };
        const expectedNewTaskList = [
          { ...mockTask, id: '2', title: 'Task 2' },
          toUpdateTask
        ];

        mockStore.task.list.set(taskList); // Set initial state
        mockTaskAPI.updateTask.and.returnValue(of(toUpdateTask)); // Mock API response

        // Act
        service.updateTask(toUpdateTask, toUpdateTask.id, callback);

        // Assert
        expect(mockTaskAPI.updateTask).toHaveBeenCalledWith(toUpdateTask.id, toUpdateTask);
        expect(mockStore.task.list()).toEqual(expectedNewTaskList); // New task list
        expect(mockStore.task.updated()).toEqual(toUpdateTask);
        expect(callback).toHaveBeenCalled();
        expect(mockLoggingService.recordData).toHaveBeenCalledWith('updateTask');
      });
    });

    describe('markAsComplete', () => {
      it('should mark task as complete and update store', () => {
        // Set up initial state
        const taskList = [
          { ...mockTask, id: '1', title: 'Task 1', isCompleted: false },
          { ...mockTask, id: '2', title: 'Task 2', isCompleted: false }
        ];
        const toUpdateTask = { ...mockTask, id: '1', title: 'Task 1', isCompleted: true };
        const expectedNewTaskList = [
          { ...mockTask, id: '2', title: 'Task 2', isCompleted: false },
          toUpdateTask
        ];

        mockStore.task.list.set(taskList); // Set initial state
        mockTaskAPI.updateTask.and.returnValue(of(toUpdateTask)); // Mock API response

        // Act
        service.markAsComplete(toUpdateTask);

        // Assert
        expect(mockTaskAPI.updateTask).toHaveBeenCalledWith(toUpdateTask.id, toUpdateTask);
        expect(mockStore.task.list()).toEqual(expectedNewTaskList); // New task list
        expect(mockStore.task.updated()).toEqual(toUpdateTask);
      });
    });

    describe('deleteTask', () => {
      it('should delete task and update store', () => {
        // Set up initial state
        const taskList = [
          { ...mockTask, id: '1', title: 'Task 1' },
          { ...mockTask, id: '2', title: 'Task 2' }
        ];
        const toDeleteTask =  { ...mockTask, id: '1', title: 'Task 1' };
        const expectedNewTaskList = [
          { ...mockTask, id: '2', title: 'Task 2' }
        ];

        mockStore.task.list.set(taskList); // Set initial state
        mockTaskAPI.deleteTask.and.returnValue(of(toDeleteTask)); // Mock API response

        // Act
        service.deleteTask(toDeleteTask.id);

        // Assert
        expect(mockTaskAPI.deleteTask).toHaveBeenCalledWith(toDeleteTask.id);
        expect(mockStore.task.list()).toEqual(expectedNewTaskList); // New task list
        expect(mockStore.task.deleted()).toEqual(toDeleteTask);
        expect(mockLoggingService.recordData).toHaveBeenCalledWith('deleteTask');
      });
    });

    describe('toSearch', () => {
      it('should return filtered list when search term is provided', () => {
        // Set up initial state
        const expectedSearchTaskResult = [
          { ...mockTask, id: '2', title: 'Search Task', description: 'Search Description' }
        ];
        const taskList = [
          { ...mockTask, id: '1', title: 'Task 1' },
          ...expectedSearchTaskResult
        ];
        mockStore.task.list.set(taskList); // Set initial state

        // Act
        const result = service.toSearch('Search Task', 'list', signal(taskList));

        // Assert
        expect(result()).toEqual(expectedSearchTaskResult);
      });
    });

    describe('UI Dialog Methods', () => {
      it('should open addTaskUI dialog', () => {
        mockDialog.open.and.returnValue(mockDialogRef);
        service.addTaskUI();
        expect(mockDialog.open).toHaveBeenCalledWith(TaskFormDialogComponent, jasmine.any(Object));
      });

      it('should open viewTaskUI dialog with task data', () => {
        mockDialog.open.and.returnValue(mockDialogRef);
        service.viewTaskUI(mockTask);
        expect(mockDialog.open).toHaveBeenCalledWith(TaskFormDialogComponent, jasmine.objectContaining({ data: mockTask }));
      });
    });

    describe('Snackbar Notifications', () => {
      it('should open a snackbar when a task is added', (done) => {
        const taskToAdd = { ...mockTask, title: 'Test Task' };
        mockStore.task.added.set(taskToAdd);
        service.checkAdded();

        setTimeout(() => {
          expect(mockSnackBar.open).toHaveBeenCalledWith(
            'Added:\n        Test Task\n        ',
            'close',
            jasmine.any(Object)
          );
          expect(mockStore.task.added()).toBeNull();
          done();
        });
      });

      it('should open a snackbar when a task is updated', (done) => {
        const taskToUpdate = { ...mockTask, title: 'Test Task' };
        mockStore.task.updated.set(taskToUpdate);
        service.checkUpdated();

        setTimeout(() => {
          expect(mockSnackBar.open).toHaveBeenCalledWith(
            'Updated:\n        Test Task\n        ',
            'close',
            jasmine.any(Object)
          );
          expect(mockStore.task.updated()).toBeNull();
          done();
        });
      });

      it('should open a snackbar when a task is deleted', (done) => {
        const taskToDelete = { ...mockTask, title: 'Test Task' };
        mockStore.task.deleted.set(taskToDelete);
        service.checkDeleted();

        setTimeout(() => {
          expect(mockSnackBar.open).toHaveBeenCalledWith(
            'Deleted:\n        Test Task\n        ',
            'close',
            jasmine.any(Object)
          );
          expect(mockStore.task.deleted()).toBeNull();
          done();
        });
      });
    });
  });

  describe('Edge Cases', () => {
    describe('Task List Operations', () => {
      it('should handle empty list from API', () => {
        mockTaskAPI.getTasks.and.returnValue(of([]));

        service.getTasks();

        expect(mockTaskAPI.getTasks).toHaveBeenCalled();
        expect(mockStore.task.list()).toEqual([]);
      });

      it('should handle API error when fetching list', () => {
        mockTaskAPI.getTasks.and.returnValue(throwError(() => new Error('API Error')));

        service.getTasks();

        expect(mockTaskAPI.getTasks).toHaveBeenCalled();
        expect(mockStore.task.list()).toEqual([]);
      });
    });

    describe('addTask', () => {
      it('should not add task if task is null', () => {
        service.addTask(null as unknown as TTask);
        expect(mockTaskAPI.addTask).not.toHaveBeenCalled();
        expect(mockStore.task.added()).toBeNull();
        expect(mockLoggingService.recordData).not.toHaveBeenCalledWith('addTask');
      });

      it('should handle API errors on adding task', (done) => {
        mockTaskAPI.addTask.and.returnValue(throwError(() => new Error('Failed to add task')));
        mockLoggingService.recordData.calls.reset();
        mockStore.task.list.set([]); // Set initial state

        service.addTask(mockTask);

        setTimeout(() => {
          expect(mockTaskAPI.addTask).toHaveBeenCalledWith(mockTask);
          expect(mockLoggingService.recordData).not.toHaveBeenCalled();
          expect(mockStore.task.list()).not.toContain(mockTask);
          expect(mockStore.task.added()).toBeNull();
          done();
        });
      });
    });

    describe('updateTask', () => {
      it('should not update task if task or id is missing', () => {
        service.updateTask(null as unknown as TTask, '1', () => {});
        expect(mockTaskAPI.updateTask).not.toHaveBeenCalled();
        expect(mockStore.task.updated()).toBeNull();
        expect(mockLoggingService.recordData).not.toHaveBeenCalledWith('updateTask');
      });

      it('should handle API errors on updating task', (done) => {
        const existingTask = { ...mockTask, title: 'Original Task' };
        mockStore.task.list.set([existingTask]);
        mockTaskAPI.updateTask.and.returnValue(throwError(() => new Error('Failed to update task')));
        const callback = jasmine.createSpy('callback');
        mockLoggingService.recordData.calls.reset();

        service.updateTask(mockTask, '1', callback);

        setTimeout(() => {
          expect(mockTaskAPI.updateTask).toHaveBeenCalled();
          expect(callback).not.toHaveBeenCalled();
          expect(mockLoggingService.recordData).not.toHaveBeenCalledWith('updateTask');
          expect(mockStore.task.list().find(t => t.id === '1')?.title).toBe('Original Task');
          expect(mockStore.task.updated()).toBeNull();
          done();
        });
      });
    });

    describe('markAsComplete', () => {
      it('should not mark task as complete if task or id is missing', () => {
        service.markAsComplete({ ...mockTask, id: undefined });
        expect(mockTaskAPI.updateTask).not.toHaveBeenCalled();
        expect(mockStore.task.updated()).toBeNull();
      });

      it('should handle API errors on marking task as complete', (done) => {
        mockTaskAPI.updateTask.and.returnValue(throwError(() => new Error('Failed to update task')));
        mockLoggingService.recordData.calls.reset();

        service.markAsComplete(mockTask);

        setTimeout(() => {
          expect(mockTaskAPI.updateTask).toHaveBeenCalled();
          expect(mockStore.task.updated()).toBeNull();
          done();
        });
      });
    });

    describe('deleteTask', () => {
      it('should handle deleting completed task', () => {
        const completedTask = { ...mockTask, isCompleted: true };
        mockTaskAPI.deleteTask.and.returnValue(of(completedTask));
        service.deleteTask('1');
        expect(mockStore.task.deleted()).toEqual(completedTask);
      });

      it('should handle deleting archived task', () => {
        const archivedTask = { ...mockTask, isArchive: true };
        mockTaskAPI.deleteTask.and.returnValue(of(archivedTask));
        service.deleteTask('1');
        expect(mockStore.task.deleted()).toEqual(archivedTask);
      });

      it('should not delete task if id is missing', () => {
        mockStore.task.deleted.set(null);
        service.deleteTask(undefined);

        expect(mockTaskAPI.deleteTask).not.toHaveBeenCalled();
        expect(mockStore.task.deleted()).toBeNull();
        expect(mockLoggingService.recordData).not.toHaveBeenCalledWith('deleteTask');
      });

      it('should handle API errors on deleting task', (done) => {
        mockStore.task.list.set([mockTask]);
        mockStore.task.deleted.set(null);
        mockTaskAPI.deleteTask.and.returnValue(throwError(() => new Error('Failed to delete task')));
        mockLoggingService.recordData.calls.reset();

        service.deleteTask('99');

        setTimeout(() => {
          expect(mockTaskAPI.deleteTask).toHaveBeenCalledWith('99');
          expect(mockLoggingService.recordData).not.toHaveBeenCalledWith('deleteTask');
          expect(mockStore.task.list()).toContain(mockTask);
          expect(mockStore.task.deleted()).toBeNull();
          done();
        });
      });
    });

    describe('toSearch', () => {
      it('should handle case-insensitive search', () => {
        const list = signal([mockTask]);
        const result = service.toSearch('test', 'list', list);
        expect(result).toBe(mockStore.task.search.filteredListByTitle);
      });

      it('should handle search with special characters', () => {
        const specialTask = { ...mockTask, title: 'Test@#$%^&*()' };
        const list = signal([specialTask]);
        const result = service.toSearch('@#$%^&*()', 'list', list);
        expect(result).toBe(mockStore.task.search.filteredListByTitle);
      });

      it('should return original list when no search term is provided', () => {
        const list = signal([mockTask]);
        const result = service.toSearch('', 'list', list);
        expect(result).toBe(list);
      });

      it('should handle search with empty list', () => {
        const list = signal([]);
        const result = service.toSearch('Test', 'list', list);
        expect(result).toBe(mockStore.task.search.filteredListByTitle);
      });
    });

    describe('UI Dialog Methods', () => {
      describe('addTaskUI', () => {
        it('should close existing dialog before opening new one', () => {
          mockDialog.open.and.returnValue(mockDialogRef);
          service.addTaskUI();
          expect(mockDialogRef.close).toHaveBeenCalled();
        });

        it('should handle dialog close event', () => {
          mockDialog.open.and.returnValue(mockDialogRef);
          service.addTaskUI();
          expect(mockDialogRef.afterClosed).toHaveBeenCalled();
        });
      });

      describe('viewTaskUI', () => {
        it('should close existing dialog before opening new one', () => {
          mockDialog.open.and.returnValue(mockDialogRef);
          service.viewTaskUI(mockTask);
          expect(mockDialogRef.close).toHaveBeenCalled();
        });

        it('should handle dialog close event', () => {
          mockDialog.open.and.returnValue(mockDialogRef);
          service.viewTaskUI(mockTask);
          expect(mockDialogRef.afterClosed).toHaveBeenCalled();
        });
      });
    });

    describe('Snackbar Notifications', () => {
      describe('checkAdded', () => {
        it('should handle long task titles in snackbar', (done) => {
          const longTitle = 'This is a very long task title that should be truncated in the snackbar notification';
          const taskToAdd = { ...mockTask, title: longTitle };
          mockStore.task.added.set(taskToAdd);
          service.checkAdded();

          setTimeout(() => {
            expect(mockSnackBar.open).toHaveBeenCalledWith(
              'Added:\n        This is a very long \n        ...',
              'close',
              jasmine.any(Object)
            );
            done();
          });
        });

        it('should handle special characters in task titles', (done) => {
          const specialTitle = 'Task with @#$%^&*() characters';
          const taskToAdd = { ...mockTask, title: specialTitle };
          mockStore.task.added.set(taskToAdd);
          service.checkAdded();

          setTimeout(() => {
            expect(mockSnackBar.open).toHaveBeenCalledWith(
              'Added:\n        Task with @#$%^&*() \n        ...',
              'close',
              jasmine.any(Object)
            );
            done();
          });
        });

        it('should not show snackbar for null task', (done) => {
          mockStore.task.added.set(null);
          service.checkAdded();

          setTimeout(() => {
            expect(mockSnackBar.open).not.toHaveBeenCalled();
            done();
          });
        });
      });

      describe('checkUpdated', () => {
        it('should handle long task titles in snackbar', (done) => {
          const longTitle = 'This is a very long task title that should be truncated in the snackbar notification';
          const taskToUpdate = { ...mockTask, title: longTitle };
          mockStore.task.updated.set(taskToUpdate);
          service.checkUpdated();

          setTimeout(() => {
            expect(mockSnackBar.open).toHaveBeenCalledWith(
              'Updated:\n        This is a very long \n        ...',
              'close',
              jasmine.any(Object)
            );
            done();
          });
        });

        it('should handle special characters in task titles', (done) => {
          const specialTitle = 'Task with @#$%^&*() characters';
          const taskToUpdate = { ...mockTask, title: specialTitle };
          mockStore.task.updated.set(taskToUpdate);
          service.checkUpdated();

          setTimeout(() => {
            expect(mockSnackBar.open).toHaveBeenCalledWith(
              'Updated:\n        Task with @#$%^&*() \n        ...',
              'close',
              jasmine.any(Object)
            );
            done();
          });
        });

        it('should not show snackbar for null task', (done) => {
          mockStore.task.updated.set(null);
          service.checkUpdated();

          setTimeout(() => {
            expect(mockSnackBar.open).not.toHaveBeenCalled();
            done();
          });
        });
      });

      describe('checkDeleted', () => {
        it('should handle long task titles in snackbar', (done) => {
          const longTitle = 'This is a very long task title that should be truncated in the snackbar notification';
          const taskToDelete = { ...mockTask, title: longTitle };
          mockStore.task.deleted.set(taskToDelete);
          service.checkUpdated();

          setTimeout(() => {
            expect(mockSnackBar.open).toHaveBeenCalledWith(
              'Deleted:\n        This is a very long \n        ...',
              'close',
              jasmine.any(Object)
            );
            done();
          });
        });

        it('should handle special characters in task titles', (done) => {
          const specialTitle = 'Task with @#$%^&*() characters';
          const taskToDelete = { ...mockTask, title: specialTitle };
          mockStore.task.deleted.set(taskToDelete);
          service.checkDeleted();

          setTimeout(() => {
            expect(mockSnackBar.open).toHaveBeenCalledWith(
              'Deleted:\n        Task with @#$%^&*() \n        ...',
              'close',
              jasmine.any(Object)
            );
            done();
          });
        });

        it('should not show snackbar for null task', (done) => {
          mockStore.task.deleted.set(null);
          service.checkDeleted();

          setTimeout(() => {
            expect(mockSnackBar.open).not.toHaveBeenCalled();
            done();
          });
        });
      });

    });
  });
});
