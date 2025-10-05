// Angular
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';

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
import { filter } from 'rxjs';
import { AuthenticationService } from '../../features/authentication/authentication.service';
import { STORE_TOKEN } from '../../data-access/state/state.store';
import { IAuth } from '../../utils/models/user.model';


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
  private readonly _ROUTER = inject(Router);
  private readonly _MEDIA = inject(MediaMatcher);
  private readonly _STORE = inject(STORE_TOKEN);

  private readonly _AUTH_FIREBASE_SERVICE= inject(AuthFirebaseService);
  readonly _TASK_SERVICE = inject(TaskService);
  readonly _AUTHENTICATION_SERVICE = inject(AuthenticationService);
  readonly NAVIGATIONS: TMenu[] = inject(SidenavService)?.navigations;

  readonly _user = this._STORE().authentication.auth;
  readonly user = computed(() => {
    const user = this._user() as IAuth;

    return {
      ...user,
      isAuth: user?.token && user?.status === 'login' ? true : false
    }
  });


  mobileQuery: MediaQueryList = this._MEDIA.matchMedia('(max-width: 600px)');
  private _mobileQueryListener = () => this._CD.detectChanges();

  // - no reactivity
  pageSelected = signal('home');

  constructor() {
    this._ROUTER.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => this.pageSelected.set(e.urlAfterRedirects.split('/')[1]));
  }

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
    // this._AUTH_FIREBASE_SERVICE.login();
  }

  register(): void {
    // this._AUTH_FIREBASE_SERVICE.register();
  }
}
