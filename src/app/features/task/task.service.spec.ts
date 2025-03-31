/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { TaskAPI } from '../../data-access/apis/task.api';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoggingService } from '../../utils/services/logging.service';
import { of, throwError } from 'rxjs';
import { TTask } from '../../utils/models/task.model';
import { TaskFormDialogComponent } from '../../uis/forms/task-form-dialog/task-form-dialog.component';
import { MatDialogRef } from '@angular/material/dialog';
import { computed, signal, WritableSignal } from '@angular/core';
import { IState } from '../../data-access/state/state.model';
import { STORE } from '../../data-access/state/state.store';

// Helper functions from state.store.ts
const IS_TODAY = (taskDate: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return taskDate.split('T')[0] === today;
}

const NOT_TODAY = (taskDate: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return taskDate.split('T')[0] !== today;
}

// Create a mock store service
class MockStoreService {
  private store: IState;

  constructor() {
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
    this.store = {
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
            const ORDER = this.store.task.sort.status();
            const TASKS = this.store.task.list();

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
            const FILTER = this.store.task.filter.status();
            const TASKS = this.store.task.list();

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
            const TASKS = this.store.task.list();
            return [...TASKS]?.length;
          }),
          completeListComputed: computed(() => {
            const TASKS = this.store.task.list();
            return [...TASKS].filter(task => task.isCompleted)?.length;
          }),
          todoListComputed: computed(() => {
            const TASKS = this.store.task.list();
            return [...TASKS].filter(task => !task.isCompleted)?.length;
          }),
          highPriorityListComputed: computed(() => {
            const TASKS = this.store.task.list();
            return [...TASKS].filter(task => task.priority === 'high')?.length;
          })
        },
        search: {
          page: signal('list'),
          term: signal(''),
          list: signal([]),
          filteredListByTitle: computed(() => {
            const TERM = this.store.task.search.term();
            const LIST = this.store.task.search.list();
            return LIST.filter(task => task.title.toLowerCase().includes(TERM.toLowerCase()));
          })
        },
        toString: () => ({
          list: this.store.task.list(),
          added: this.store.task.added(),
          updated: this.store.task.updated(),
          viewed: this.store.task.viewed(),
          deleted: this.store.task.deleted()
        })
      }
    };
  }

  getStore(): IState {
    return this.store;
  }
}

describe('TaskService', () => {
  let service: TaskService;
  let mockTaskAPI: jasmine.SpyObj<TaskAPI>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;
  let mockLoggingService: jasmine.SpyObj<LoggingService>;
  let mockStoreService: MockStoreService;

  const mockTask: TTask = {
    id: '1',
    title: 'Original Task',
    description: 'Test Description',
    date: new Date().toISOString(),
    priority: 'high',
    isCompleted: false,
    isArchive: false
  };

  const mockDialogRef = {
    afterClosed: () => of('closed'),
    close: () => {},
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
      addTask: of(mockTask),
      updateTask: of({ ...mockTask, title: 'Updated Task' }),
      deleteTask: of(mockTask)
    });

    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockSnackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    mockLoggingService = jasmine.createSpyObj('LoggingService', ['recordData']);
    mockStoreService = new MockStoreService();

    TestBed.configureTestingModule({
      providers: [
        TaskService,
        { provide: TaskAPI, useValue: mockTaskAPI },
        { provide: MatDialog, useValue: mockDialog },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: LoggingService, useValue: mockLoggingService },
        { provide: STORE, useValue: () => mockStoreService.getStore() }
      ]
    });

    service = TestBed.inject(TaskService);
    (service as any).dialogRef = mockDialogRef;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getTask', () => {
    it('should fetch tasks and update store', () => {
      service.getTask();
      expect(mockTaskAPI.getTasks).toHaveBeenCalled();
      expect(mockStoreService.getStore().task.list()).toEqual([mockTask]);
    });
  });

  describe('addTask', () => {
    it('should add task and update store', () => {
      service.addTask(mockTask);
      expect(mockTaskAPI.addTask).toHaveBeenCalledWith(mockTask);
      expect(mockStoreService.getStore().task.added()).toEqual(mockTask);
    });
  });

  describe('updateTask', () => {
    it('should update task and update store', () => {
      const callback = jasmine.createSpy('callback');
      service.updateTask(mockTask, '1', callback);
      expect(mockTaskAPI.updateTask).toHaveBeenCalledWith('1', mockTask);
      expect(mockStoreService.getStore().task.updated()).toEqual({ ...mockTask, title: 'Updated Task' });
      expect(callback).toHaveBeenCalled();
    });
  });

  describe('deleteTask', () => {
    it('should delete task and update store', () => {
      service.deleteTask('1');
      expect(mockTaskAPI.deleteTask).toHaveBeenCalledWith('1');
      expect(mockStoreService.getStore().task.deleted()).toEqual(mockTask);
    });
  });

  describe('Edge Cases', () => {
    describe('getTask', () => {
      it('should handle API errors gracefully', (done) => {
        mockLoggingService.recordData.calls.reset();
        const error = new Error('API Error');
        mockTaskAPI.getTasks.and.returnValue(throwError(() => error));

        service.getTask();

        setTimeout(() => {
          expect(mockTaskAPI.getTasks).toHaveBeenCalled();
          expect(mockLoggingService.recordData).not.toHaveBeenCalled();
          expect(mockStoreService.getStore().task.list()).toEqual([]);
          done();
        });
      });
    });

    describe('addTask', () => {
      it('should handle API errors on adding task', (done) => {
        mockLoggingService.recordData.calls.reset();
        const error = new Error('Failed to add task');
        mockTaskAPI.addTask.and.returnValue(throwError(() => error));

        service.addTask(mockTask);

        setTimeout(() => {
          expect(mockTaskAPI.addTask).toHaveBeenCalledWith(mockTask);
          expect(mockLoggingService.recordData).not.toHaveBeenCalled();
          expect(mockStoreService.getStore().task.list()).not.toContain(mockTask);
          expect(mockStoreService.getStore().task.added()).toBeNull();
          done();
        });
      });
    });

    describe('updateTask', () => {
      it('should handle API errors on updating task', (done) => {
        const existingTask = { ...mockTask, title: 'Original Task' };
        mockStoreService.getStore().task.list.set([existingTask]);
        const error = new Error('Failed to update task');
        mockTaskAPI.updateTask.and.returnValue(throwError(() => error));
        const callback = jasmine.createSpy('callback');

        mockLoggingService.recordData.calls.reset();

        service.updateTask(mockTask, '1', callback);

        setTimeout(() => {
          expect(mockTaskAPI.updateTask).toHaveBeenCalled();
          expect(callback).not.toHaveBeenCalled();
          expect(mockLoggingService.recordData).not.toHaveBeenCalled();
          expect(mockStoreService.getStore().task.list().find(t => t.id === '1')?.title).toBe('Original Task');
          expect(mockStoreService.getStore().task.updated()).toBeNull();
          done();
        });
      });
    });

    describe('deleteTask', () => {
      it('should handle API errors on deleting task', (done) => {
        mockLoggingService.recordData.calls.reset();
        mockStoreService.getStore().task.list.set([mockTask]);
        mockStoreService.getStore().task.deleted.set(null);

        const error = new Error('Failed to delete task');
        mockTaskAPI.deleteTask.and.returnValue(throwError(() => error));

        service.deleteTask('99');

        setTimeout(() => {
          expect(mockTaskAPI.deleteTask).toHaveBeenCalledWith('99');
          expect(mockLoggingService.recordData).not.toHaveBeenCalled();
          expect(mockStoreService.getStore().task.list()).toContain(mockTask);
          expect(mockStoreService.getStore().task.deleted()).toBeNull();
          done();
        });
      });
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
    beforeEach(() => {
      (service as any).dialogRef = mockDialogRef;
      // Reset all signals to null
      mockStoreService.getStore().task.added.set(null);
      mockStoreService.getStore().task.updated.set(null);
      mockStoreService.getStore().task.deleted.set(null);
    });

    it('should open a snackbar when a task is added', (done) => {
      // Set up the task in the store
      const taskToAdd = { ...mockTask, title: 'Original Task' };
      mockStoreService.getStore().task.added.set(taskToAdd);

      // Call the service method
      service.checkAdded();

      // Use setTimeout to allow the subscription to complete
      setTimeout(() => {
        expect(mockSnackBar.open).toHaveBeenCalledWith(
          'Added:\n        Original Task\n        ',
          'close',
          jasmine.any(Object)
        );
        expect(mockStoreService.getStore().task.added()).toBeNull();
        done();
      });
    });

    it('should open a snackbar when a task is updated', (done) => {
      // Set up the task in the store
      const taskToUpdate = { ...mockTask, title: 'Original Task' };
      mockStoreService.getStore().task.updated.set(taskToUpdate);

      // Call the service method
      service.checkUpdated();

      // Use setTimeout to allow the subscription to complete
      setTimeout(() => {
        expect(mockSnackBar.open).toHaveBeenCalledWith(
          'Updated:\n        Original Task\n        ',
          'close',
          jasmine.any(Object)
        );
        expect(mockStoreService.getStore().task.updated()).toBeNull();
        done();
      });
    });

    it('should open a snackbar when a task is deleted', (done) => {
      // Set up the task in the store
      const taskToDelete = { ...mockTask, title: 'Original Task' };
      mockStoreService.getStore().task.deleted.set(taskToDelete);

      // Call the service method
      service.checkDeleted();

      // Use setTimeout to allow the subscription to complete
      setTimeout(() => {
        expect(mockSnackBar.open).toHaveBeenCalledWith(
          'Deleted:\n        Original Task\n        ',
          'close',
          jasmine.any(Object)
        );
        expect(mockStoreService.getStore().task.deleted()).toBeNull();
        done();
      });
    });
  });
});
