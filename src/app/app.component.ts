// Angular
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

// Local
import { SidenavComponent } from './core/sidenav/sidenav.component';
import { STORE_TOKEN } from "../app/data-access/state/state.store";
import { TaskService } from './features/task/task.service';
import { filter } from 'rxjs';



@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, SidenavComponent, MatButtonModule, MatDialogModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = "Workie Work";

  // - di
  private readonly _TASK_SERVICE = inject(TaskService);
  private readonly _STORE = inject(STORE_TOKEN);
  private readonly _ROUTER = inject(Router);

  readonly isLandingPage = signal(false);

  constructor() {
    this._ROUTER.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) =>
        this.isLandingPage.set(
          e.urlAfterRedirects.split('/')[1] === 'verify-email'
            ? true
            : false
        )
      );
  }

  ngOnInit(): void {
    (window as any).NG_APP = {
      STORE: this._STORE,
      TASK_SERVICE: this._TASK_SERVICE
    }
  }
}
