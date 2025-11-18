// Angular
import {
  Component, OnInit, ChangeDetectionStrategy, inject, ChangeDetectorRef,
  Signal,
  computed,
  output,
  input,
  Input
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

// Material
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

// Third party
import { QuillModule } from 'ngx-quill';
import * as _moment from 'moment';
import {default as _rollupMoment} from 'moment';

// Local
import { TTask } from '../../../utils/models/task.model';
import { TaskService } from '../../../features/task/task.service';
import { STORE_TOKEN } from '../../../data-access/state/state.store';


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
  selector: 'ui-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
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
    DatePipe,
    MatSelectModule
  ],
})
export class TaskFormComponent implements OnInit {


  // TODO: create a store form?

  deleteFn = output<TTask>();
  @Input() isDone = false;


  // - di
  // private readonly _STORE = inject(STORE_TOKEN);
  private readonly _TASK_SERVICE = inject(TaskService);
  private readonly _FORM_BUILDER = inject(FormBuilder);
  // private readonly _CD = inject(ChangeDetectorRef);
  readonly _DATA: TTask & {date: _moment.Moment} = inject(MAT_DIALOG_DATA);

  readonly dueDateMin = new Date();

  // - reactivity
  // private readonly IS_SERVER_DOWN: Signal<boolean> = this._STORE().isServerDown;
  // private readonly $_IS_SERVER_DOWN: Signal<boolean> = computed(() => this.IS_SERVER_DOWN());

  // editor config
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
    dueDate: [MOMENT(Date.now()), Validators.required],
    priority: ["low", Validators.required],
  });
  status: 'view' | 'add' | 'update' | 'close' = 'view';

  ngOnChanges(): void {
    if (this.isDone) this.taskForm.disable();
    else this.taskForm.enable();
  }

  ngOnInit(): void {
    this.status = this._DATA?.title
      ? 'view'
      : 'add';

    if (this.status === 'view') {
      this.taskForm.setValue({
        title: this._DATA?.title,
        description: this._DATA?.description,
        dueDate: MOMENT(this._DATA?.dueDate),
        priority: this._DATA?.priority
      });
    }

    console.log('taskForm:', this.taskForm);

    if (this._DATA?.date) this.taskForm.controls.dueDate.setValue(this._DATA.date);

    this.taskForm.valueChanges.subscribe((data) => {
      console.log('taskform:data:', data)

      if (this.status === 'close') return;
      if (this.status === 'view' && this.taskForm.dirty) this.status = 'update';
    });

    if (this._DATA?.status === 'done') {
      this.taskForm.disable();
    }

  }


  // - editor
  // triggered when content changes in the editor
  onContentChanged(event: any): void {
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
