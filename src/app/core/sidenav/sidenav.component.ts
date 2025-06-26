// Angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

// Material
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

// Local
import { TMenu } from './sidenav.model';
import { SidenavService } from './sidenav.service';
import { SummaryComponent } from '../../uis/widgets/summary/summary.component';
import { TaskService } from '../../features/task/task.service';
import { AuthFirebaseService } from '../../utils/services/auth-firebase.service';


@Component({
  selector: 'layout-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    TitleCasePipe,
    SummaryComponent
  ],
})
export class SidenavComponent implements OnInit {
  // - di
  private readonly _CD = inject(ChangeDetectorRef);
  private readonly _MEDIA = inject(MediaMatcher);

  private readonly _AUTH_FIREBASE_SERVICE= inject(AuthFirebaseService);
  readonly _TASK_SERVICE = inject(TaskService);
  readonly NAVIGATIONS: TMenu[] = inject(SidenavService)?.navigations;

  mobileQuery: MediaQueryList = this._MEDIA.matchMedia('(max-width: 600px)');
  private _mobileQueryListener = () => this._CD.detectChanges();

  // - no reactivity
  pageSelected: string = 'home';

  ngOnInit(): void {
    // Check compatibility and add listener
    if (this.mobileQuery.addEventListener) {
      this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    } else {
      this.mobileQuery.addListener(this._mobileQueryListener); // Fallback for older browsers
    }
  }

  ngOnDestroy(): void {
    // Check compatibility and add listener
    if (this.mobileQuery.removeEventListener) {
      this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
    } else {
      this.mobileQuery.removeListener(this._mobileQueryListener); // Fallback for older browsers
    }
  }

  login(): void {
    this._AUTH_FIREBASE_SERVICE.login();
  }

  register(): void {
    this._AUTH_FIREBASE_SERVICE.register();
  }
}
