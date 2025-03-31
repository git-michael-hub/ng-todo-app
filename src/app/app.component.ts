// Angular
import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

// Local
import { SidenavComponent } from './core/sidenav/sidenav.component';
import { STORE } from "../app/data-access/state/state.store";
import { TaskService } from './features/task/task.service';



@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, SidenavComponent, MatButtonModule, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = "Workie Work";
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  private readonly _TASK_SERVICE = inject(TaskService);


  ngOnInit(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      (window as any).NG_APP = {
        STORE: STORE,
        TASK_SERVICE: this._TASK_SERVICE
      }
    }
  }
}
