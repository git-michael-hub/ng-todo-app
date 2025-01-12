import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ChangeDetectionStrategy, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { QuillEditorComponent, QuillModule } from 'ngx-quill'
import { TaskAPI } from '../../../data-access/apis/task.api';
import { TTask } from '../../../utils/models/task.model';
import { STORE } from '../../../data-access/state/state.store';
import { TASKS } from '../../../utils/values/dataTask.value';


@Component({
  selector: 'app-add-task-form',
  templateUrl: './add-task-form.component.html',
  styleUrls: ['./add-task-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    QuillModule,
    ReactiveFormsModule
  ],
})
export class AddTaskFormComponent implements OnInit {
  private formBuilderDI = inject(FormBuilder);
  private taskAPIDI = inject(TaskAPI);

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

  taskForm = this.formBuilderDI.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    date: [new Date(Date.now()), Validators.required],
    priority: ["medium", Validators.required],
  });


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
  }

  // editorContent: string = ''; // Captures the HTML content of the editor

  // Triggered when content changes in the editor
  onContentChanged(event: any) {
    // this.editorContent = event.html; // Capture HTML content
    console.log(event)
    this.taskForm.controls.description.setValue(event.html);
  }

  // Save the content to the database
  save(): void {
    // this.taskForm.value;
    // const payload = {
    //   content: this.editorContent,
    // };




    if (this.taskForm.valid) {
      // STORE().task.list.update(value => [...this.TASKS, this.taskForm.value as any]);
      // return;

      this.taskAPIDI.addTask(JSON.stringify(this.taskForm.value) as unknown as TTask)
        .subscribe({
          next: (response) => {
            console.log('Task created successfully:', response);
            STORE().task.added.set(null);
            STORE().task.list.update(value => [...value, response]);
            STORE().task.added.set(response || null);
          },
          error: (error) => {
            console.error('Error creating task:', error);
            STORE().task.added.set(null);
          },
        });
    }
    else {
      null;
    }

    console.log( this.taskForm.value)

    // // POST request to the backend API
    // this.http.post('http://localhost:3000/api/save-content', payload).subscribe(
    //   (response) => {
    //     console.log('Content saved successfully!', response);
    //   },
    //   (error) => {
    //     console.error('Error saving content:', error);
    //   }
    // );
  }

}
