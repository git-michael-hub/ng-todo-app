/* tslint:disable:no-unused-variable */
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { TaskFormDialogComponent } from './task-form-dialog.component';
import { TaskService } from '../../../features/task/task.service';
import { TaskAPI } from '../../../data-access/apis/task.api';
import { TTask } from '../../../utils/models/task.model';

describe('TaskFormDialogComponent', () => {
  let component: TaskFormDialogComponent;
  let fixture: ComponentFixture<TaskFormDialogComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockTaskAPI: jasmine.SpyObj<TaskAPI>;

  beforeEach(waitForAsync(() => {
    // Create mock services
    mockTaskService = jasmine.createSpyObj('TaskService', ['addTask', 'updateTask', 'deleteTask']);
    mockTaskAPI = jasmine.createSpyObj('TaskAPI', ['getTasks', 'addTask', 'updateTask', 'deleteTask']);

    // Create mock task data
    const mockTask: TTask = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      date: new Date().toISOString(),
      priority: 'medium',
      isCompleted: false,
      isArchive: false
    };

    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        ReactiveFormsModule,
        MatDialogModule,
        TaskFormDialogComponent
      ],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: TaskAPI, useValue: mockTaskAPI },
        { provide: MAT_DIALOG_DATA, useValue: mockTask }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
