// Angular
import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

// Local
import { SidenavComponent } from './core/sidenav/sidenav.component';



@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, SidenavComponent, MatButtonModule, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);


  ngOnInit(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      (window as any).NG_APP_ROOT = this;
    }
  }
}
