// Angular
import {
  Component, OnInit, ChangeDetectionStrategy, inject, ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

// Material
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatInputModule } from '@angular/material/input';

// Third party
import { QuillModule } from 'ngx-quill';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';

// Local
import { TTask } from '../../../utils/models/task.model';
import { TaskService } from '../../../features/task/task.service';



const MOMENT = _rollupMoment || _moment;
const MY_FORMATS = {
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
  selector: 'app-task-form-dialog',
  templateUrl: './task-form-dialog.component.html',
  styleUrls: ['./task-form-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [
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
export class TaskFormDialogComponent implements OnInit {
  private readonly _TASK_SERVICE = inject(TaskService);
  private readonly _FORM_BUILDER = inject(FormBuilder);
  private readonly _CD = inject(ChangeDetectorRef);
  readonly _DATA: TTask = inject(MAT_DIALOG_DATA);

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

  taskForm = this._FORM_BUILDER.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    date: [MOMENT(Date.now()), Validators.required],
    priority: ["low", Validators.required],
  });

  status: 'view' | 'add' | 'update' | 'close' = 'view';


  ngOnInit(): void {
    this.status = this._DATA ? 'view' : 'add';

    if (this.status === 'view') {
      this.taskForm.setValue({
        title: this._DATA.title,
        description: this._DATA.description,
        date: MOMENT(this._DATA.date),
        priority: this._DATA.priority
      });
    }

    this.taskForm.valueChanges.subscribe(() => {
      if (this.status === 'close') return;
      if (this.status === 'view') this.status = 'update';
    });
  }

  addTask(): void {
    if (this.taskForm.invalid) return;

    const DATA = JSON.stringify(this.taskForm.value) as unknown as TTask;
    this._TASK_SERVICE.addTask(DATA);
  }

  updateTask(): void {
    if (this.taskForm.invalid || !this._DATA?.id) return;

    const DATA = JSON.stringify(this.taskForm.value) as unknown as TTask;
    const CALLBACK = () => {
      this.status = 'view';
      this._CD.markForCheck();
    };

    this._TASK_SERVICE.updateTask(DATA, this._DATA?.id, CALLBACK);
  }

  deleteTask(id?: string): void {
    if (!id) return;

    this._TASK_SERVICE.deleteTask(id);
  }

  cancelUpdate(): void {
    this.taskForm.setValue({
      title: this._DATA.title,
      description: this._DATA.description,
      date: MOMENT(this._DATA.date),
      priority: this._DATA.priority
    });

    this.status = 'view';
    this._CD.markForCheck();
  }


  // Triggered when content changes in the editor
  onContentChanged(event: any): void {
    console.log(event)
    this.taskForm.controls.description.setValue(event.html);
  }

  imageHandler(): void {
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

}
