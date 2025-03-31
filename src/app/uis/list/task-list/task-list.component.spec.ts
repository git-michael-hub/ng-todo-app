// Angular
import { HttpClientModule } from '@angular/common/http';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { NO_ERRORS_SCHEMA } from '@angular/core';
/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

//  Material
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

// Local
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../../features/task/task.service';
import { PriorityPipe } from '../../../utils/pipes/priority.pipe';
import { TTask } from '../../../utils/models/task.model';
import { TASK_DATA_TEST, TASKS_DATA_TEST } from '../../../utils/values/dataTask.value';



describe('TaskListComponent - UI', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockViewport: jasmine.SpyObj<CdkVirtualScrollViewport>;

  beforeEach(waitForAsync(() => {
    mockTaskService = jasmine.createSpyObj(
      'TaskService',
      ['viewTaskUI', 'markAsComplete', 'deleteTask']
    );
    mockViewport = jasmine.createSpyObj('CdkVirtualScrollViewport', ['checkViewportSize']);

    TestBed.configureTestingModule({
      imports: [
        TaskListComponent,
        HttpClientModule,
        MatButtonModule,
        MatCheckboxModule,
        ScrollingModule,
        PriorityPipe
      ],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: CdkVirtualScrollViewport, useValue: mockViewport }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    component.tasks = [...TASKS_DATA_TEST]; // Ensure it's initialized
    component.SERVICE = mockTaskService; // Access private SERVICE
    fixture.detectChanges();
  });

  describe('Unit Tests', () => {
    describe('Happy Path', () => {
      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it('should call viewTaskUI() on service when viewTaskUI() is called', () => {
        const task = { id: '1', title: 'Test Task' } as any;
        component.viewTaskUI(task);
        expect(mockTaskService.viewTaskUI).toHaveBeenCalledWith(task);
      });

      it('should call markAsComplete() on service when markAsComplete() is called', () => {
        const task = { id: '1', title: 'Test Task' } as any;
        component.markAsComplete(task);
        expect(mockTaskService.markAsComplete).toHaveBeenCalledWith(task);
      });

      it('should call deleteTask() on service when deleteTask() is called with an ID', () => {
        const taskId = '123';
        component.deleteTask(taskId);
        expect(mockTaskService.deleteTask).toHaveBeenCalledWith(taskId);
      });
    });

    describe('Edge case', () => {
      describe('viewTaskUI()', () => {
        it('should not call viewTaskUI() on service when viewTaskUI() is called without a Task object', () => {
          component.viewTaskUI({} as TTask);
          expect(mockTaskService.viewTaskUI).not.toHaveBeenCalled();
        });

        it('should not call viewTaskUI() on service when viewTaskUI() is called without an id from Task object', () => {
          component.viewTaskUI({
            ...TASK_DATA_TEST,
            id: undefined
          });
          expect(mockTaskService.viewTaskUI).not.toHaveBeenCalled();
        });
      });

      describe('markAsComplete()', () => {
        it('should not call markAsComplete() on service when markAsComplete() is called without a Task object', () => {
          component.markAsComplete({} as TTask);
          expect(mockTaskService.markAsComplete).not.toHaveBeenCalled();
        });

        it('should not call markAsComplete() on service when markAsComplete() is called without an id from Task object', () => {
          component.markAsComplete({
            ...TASK_DATA_TEST,
            id: undefined
          });
          expect(mockTaskService.markAsComplete).not.toHaveBeenCalled();
        });
      });

      describe('deleteTask()', () => {
        it('should not call deleteTask() on service when deleteTask() is called without an ID', () => {
          component.deleteTask('');
          expect(mockTaskService.deleteTask).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('Integration Tests', () => {
    it('should render task items inside virtual scroll viewport', (done) => {
      // Force Angular to run lifecycle hooks
      fixture.whenStable().then(() => {
        fixture.detectChanges(); // Trigger another change detection cycle

        const viewport = fixture.debugElement.query(By.css('cdk-virtual-scroll-viewport'));
        expect(viewport).toBeTruthy(); // Ensure viewport exists

        setTimeout(() => { // Wait for rendering cycle
          const items = fixture.debugElement.queryAll(By.css('[data-test="list-item"]'));
          expect(items.length).toBeGreaterThan(0); // Check that tasks are rendered

          done();
        }, 100);
      });
    });

    it('should invoke viewTaskUI() if "View" button is clicked', (done) => {
      // Force Angular to run lifecycle hooks
      fixture.whenStable().then(() => {
        fixture.detectChanges(); // Trigger another change detection cycle

        setTimeout(() => { // Wait for rendering cycle
          const btns_view = fixture.debugElement.queryAll(By.css('[data-test="list-btn-view"]'));
          expect(btns_view.length).toBeGreaterThan(0); // Ensure at least one button exists

          const first_btn_view = btns_view[0]; // Get first button
          first_btn_view.nativeElement.click();

          expect(mockTaskService.viewTaskUI).toHaveBeenCalled();

          done();
        }, 100);
      });
    });

    it('should invoke deleteTask() if "Delete" button is clicked', (done) => {
      // Force Angular to run lifecycle hooks
      fixture.whenStable().then(() => {
        fixture.detectChanges(); // Trigger another change detection cycle

        setTimeout(() => { // Wait for rendering cycle
          const cypress = fixture.debugElement.query(By.css('[data-test="list-show-buttons"]'));
          cypress.nativeElement.click();

          const btns_delete = fixture.debugElement.queryAll(By.css('[data-test="list-btn-delete"]'));
          expect(btns_delete.length).toBeGreaterThan(0); // Ensure at least one button exists

          const first_btn_delete = btns_delete[0]; // Get first button
          first_btn_delete.nativeElement.click();

          expect(mockTaskService.deleteTask).toHaveBeenCalled();

          done();
        }, 100);
      });
    });

    it('should invoke markAsComplete() if checkbox is toggled', (done) => {
      // Force Angular to run lifecycle hooks
      fixture.whenStable().then(() => {
        fixture.detectChanges(); // Trigger another change detection cycle

        setTimeout(() => { // Wait for rendering cycle
          const cypress = fixture.debugElement.query(By.css('[data-test="list-show-buttons"]'));
          cypress.nativeElement.click();

          const checkbox = fixture.debugElement.query(By.css('[data-test="list-checkbox-complete"]'));
          checkbox.nativeElement.click();

          expect(mockTaskService.markAsComplete).toHaveBeenCalled();

          done();
        }, 100);
      });
    });
  });

});
