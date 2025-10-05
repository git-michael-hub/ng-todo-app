import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit } from '@angular/core';
import { TError } from '../../../utils/models/common.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { STORE_TOKEN } from '../../../data-access/state/state.store';
import { CommonModule } from '@angular/common';
import { IAuth } from '../../../utils/models/user.model';

@Component({
  selector: 'feature-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
  ]
})
export class VerifyEmailComponent implements OnInit {
  private readonly _HOST = 'VerifyEmailComponent';

  private readonly _STORE = inject(STORE_TOKEN);
  private readonly _AUTH_SERVICE = inject(AuthenticationService);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  // private authService = inject(AuthenticationService);

  isVerifyEmail = computed(() =>
    (this._STORE().authentication.auth() as IAuth)?.isVerifyEmail
  );

  isVerifyEmailError = computed(() =>
    this._STORE().authentication.error()
  );

  isVerifying = true;
  verificationResult: { success: boolean; message: string } | null = null;

  constructor() {
    // effect(() => {
    //   console.log('VerifyEmailComponent:error:');
    //   if (this._STORE().authentication.auth()?.isVerifyEmail) {
    //     this.isVerifying = false;
    //   }
    // });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.verifyEmail(token);
      }
    });
  }

  async verifyEmail(token: string) {
    this._AUTH_SERVICE.verifyEmail(token);
    // try {
    //   this.isVerifying = true;
    //   const result = await this.authService.verifyEmail(token).toPromise();
    //   this.verificationResult = result;
    // } catch (error: TError) {
    //   this.verificationResult = {
    //     success: false,
    //     message: error.error?.message || 'Verification failed'
    //   };
    // } finally {
    //   this.isVerifying = false;
    // }
  }

  // goToLogin() {
  //   this.router.navigate(['/login']);
  // }

  ngOnDestroy() {
    this._STORE().authentication.error.set(undefined);
    this._STORE().authentication.auth.set({ source: this._HOST + 'ngOnDestroy'});
  }

}
