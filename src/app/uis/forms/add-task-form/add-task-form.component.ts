import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { QuillEditorComponent, QuillModule } from 'ngx-quill'
import { TaskAPI } from '../../../data-access/apis/task.api';
import { TTask } from '../../../utils/models/task.model';
import { STORE } from '../../../data-access/state/state.store';
import { TASKS } from '../../../utils/values/dataTask.value';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import {MatInputModule} from '@angular/material/input';

import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';

const moment = _rollupMoment || _moment;



export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};


@Component({
  selector: 'app-add-task-form',
  templateUrl: './add-task-form.component.html',
  styleUrls: ['./add-task-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [
    // provideNativeDateAdapter()
    provideMomentDateAdapter(MY_FORMATS),
  ],
  imports: [
    MatDialogModule,
    MatButtonModule,
    QuillModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatInputModule,
  ],
})
export class AddTaskFormComponent implements OnInit {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _taskAPI = inject(TaskAPI);
  private readonly _data: TTask = inject(MAT_DIALOG_DATA);
  private readonly _cd = inject(ChangeDetectorRef);

  TASKS = TASKS;

  editorModules = {
    toolbar: false, // Disable toolbar
    // toolbar: {
    //   container: [
    //     // ['bold', 'italic', 'underline'], // Formatting options
    //     // ['link', 'image', 'video'], // Media options
    //   ],
    //   // handlers: {
    //   //   image: this.imageHandler.bind(this), // Custom handler for images
    //   // },
    // },

  };

  taskForm = this._formBuilder.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    date: [moment(Date.now()), Validators.required],
    priority: ["low", Validators.required],
  });

  // isViewTask = false;
  // toUpdate = false;

  status: 'view' | 'add' | 'update' | 'close' = 'view';

  // taskForTimeout: any;


  imageHandler() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        console.log('FORM data:', formData)

        // Upload the image to the backend
        // this.http.post('http://localhost:3000/api/upload-image', formData).subscribe(
        //   (response: any) => {
        //     const imageUrl = response.url; // Get the uploaded image URL
        //     const editor = document.querySelector('.ql-editor') as HTMLElement;
        //     const range = this.quillEditor.getSelection();
        //     this.quillEditor.insertEmbed(range.index, 'image', imageUrl); // Insert the image into the editor
        //   },
        //   (error) => {
        //     console.error('Image upload failed:', error);
        //   }
        // );
      }
    };
  }

  ngOnInit() {
    console.log('dataDI:', this._data);
    console.log('taskForm:', this.taskForm);

    this.status = this._data ? 'view' : 'add';

    if (this.status === 'view') {
      this.taskForm.setValue({
        title: this._data.title, // titlecase
        description: this._data.description,
        date: moment(this._data.date),
        priority: this._data.priority
      });
    }

    this.taskForm.valueChanges.subscribe(data => {
      // console.log('title:', title);
      // console.log('status:', this.status);

      if (this.status === 'close') return;

      if (this.status === 'view') this.status = 'update';

      // if (this.taskForTimeout) this.taskForTimeout = undefined;
      // this.taskForTimeout = setTimeout(() => {
      //   if (this.status === 'view') this.status = 'update';
      // }, 2000);
    });

    this.taskForm.controls.title.valueChanges.subscribe(title => {
    //   console.log('title:', title);
    //   console.log('status:', this.status);

    //   if (this.status === 'view') this.status = 'update';

    //   // if (isViewTask)
    //   // this.toUpdate = true;
    // titlecase
    });

    // this.taskForm.controls.description.valueChanges.subscribe(description => {
    //   console.log('description:', description);
    //   console.log('status:', this.status);

    //   if (this.status === 'view') this.status = 'update';
    //   // this.toUpdate = true;
    // });


  }

  ngOnDestroy() {

  }

  cancelUpdate(): void {
    this.taskForm.setValue({
      title: this._data.title,
      description: this._data.description,
      date: moment(this._data.date),
      priority: this._data.priority
    });

    this.status = 'view';

    console.log('status:cancelUpdate:', this.status);
    this._cd.markForCheck();
  }

  // editorContent: string = ''; // Captures the HTML content of the editor

  // Triggered when content changes in the editor
  onContentChanged(event: any) {
    // this.editorContent = event.html; // Capture HTML content
    console.log(event)
    this.taskForm.controls.description.setValue(event.html);
  }

  // Save the content to the database
  addTask(): void {
    console.log('save: taskForm.value:', this.taskForm.value);
    // return;
    if (this.taskForm.valid) {
      const data = JSON.stringify(this.taskForm.value) as unknown as TTask;
      this._taskAPI.addTask(data)
        .subscribe({
          next: (response) => {
            console.log('Task created successfully:', response);
            STORE().task.list.update(tasks => [...tasks, response]);
            STORE().task.added.set(response || null);
          },
          error: (error) => {
            console.error('Error creating task:', error);
            STORE().task.added.set(null);
          },
        });
    }
  }

  updateTask(): void {
    console.log('update: taskForm.value:', this.taskForm.value);
    if (this.taskForm.valid && this._data?.id) {
      const data = JSON.stringify(this.taskForm.value) as unknown as TTask;
      this._taskAPI.updateTask(this._data.id, data)
        .subscribe({
          next: (response) => {
            console.log('Task updated successfully:', response);
            STORE().task.list.update(
              tasks => [
                ...(() => tasks.filter(task => task.id !== this._data.id))(),
                response
              ]
            );
            STORE().task.updated.set(response || null);

            this.status = 'view';
            this._cd.markForCheck();
          },
          error: (error) => {
            console.error('Error updating task:', error);
            STORE().task.updated.set(null);
          },
        });
    }
  }

}
