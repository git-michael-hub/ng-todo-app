// Angular
import {
  Component, OnInit, ChangeDetectionStrategy, inject, ChangeDetectorRef,
  Signal,
  computed
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

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
import { STORE_TOKEN } from '../../../data-access/state/state.store';
import { TaskFormComponent } from '../../forms/task-form/task-form.component';
import { MatCheckboxModule } from '@angular/material/checkbox';


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
  selector: 'ui-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
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
    TaskFormComponent,
    MatCheckboxModule,
  ],
})
export class TaskDialogComponent {

  // - di
  private readonly _STORE = inject(STORE_TOKEN);
  private readonly _TASK_SERVICE = inject(TaskService);
  // private readonly _FORM_BUILDER = inject(FormBuilder);
  private readonly _CD = inject(ChangeDetectorRef);
  _DATA: TTask & {date: _moment.Moment} = inject(MAT_DIALOG_DATA);

  // - reactivity
  private readonly IS_SERVER_DOWN: Signal<boolean> = this._STORE().isServerDown;
  private readonly $_IS_SERVER_DOWN: Signal<boolean> = computed(() => this.IS_SERVER_DOWN());


  // - actions
  addTask(form: FormGroup<any>): void {
    if (form.invalid) return;

    this._TASK_SERVICE.addTask(form.value as unknown as TTask);
  }

  updateTask(form: FormGroup<any>): void {
    if (form.invalid || !this._DATA?.id) return;

    const CALLBACK = () => {
      this._CD.markForCheck();
    };
    let valueForm: TTask = form.value as unknown as TTask;

    if (this.$_IS_SERVER_DOWN()) {
      valueForm = {
        ...valueForm,
        id: this._DATA?.id,
        status: this._DATA?.status,
        createdAt: this._DATA?.createdAt,
        updatedAt: this._DATA?.updatedAt
      } as unknown as TTask
    }

    this._TASK_SERVICE.updateTask(valueForm as unknown as TTask, this._DATA?.id, CALLBACK);
  }

  deleteTask(task: TTask, id?: string): void {
    if (!task || !id) return;

    this._TASK_SERVICE.deleteTask(task, id);
  }

  cancelUpdate(form: FormGroup<any>): void {
    form.setValue({
      title: this._DATA.title,
      description: this._DATA.description,
      dueDate: MOMENT(this._DATA.dueDate),
      priority: this._DATA.priority
    });

    this._CD.markForCheck();
  }

  markAsComplete(): void {
    if (!this._DATA || !this._DATA.id) return;

    if (this._DATA.status === 'done') {
      this._DATA = {...this._DATA, status: 'todo'};

      this._TASK_SERVICE.updateTask(this._DATA, this._DATA.id || '', () => {}, false);
    }
    else {
      this._DATA = {...this._DATA, status: 'done'};
      this._TASK_SERVICE.markAsComplete(this._DATA);
    }
  }


}
