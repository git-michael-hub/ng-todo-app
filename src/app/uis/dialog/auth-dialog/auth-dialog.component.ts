import { Component, inject, OnInit } from '@angular/core';
import { LoginComponent } from '../../../features/authentication/login/login.component';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { RegisterFormComponent } from '../../forms/register-form/register-form.component';
import { RegisterComponent } from '../../../features/authentication/register/register.component';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrls: ['./auth-dialog.component.css'],
  standalone: true,
  imports: [
    LoginComponent,
    RegisterComponent,
    MatDialogModule,
    MatButtonModule,
  ]
})
export class AuthDialogComponent implements OnInit {
  data = inject(MAT_DIALOG_DATA);

  constructor() { }

  ngOnInit() {
  }

}
