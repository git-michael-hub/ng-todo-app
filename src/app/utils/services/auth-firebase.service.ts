import { inject, Injectable } from '@angular/core';
import { Auth, authState, GoogleAuthProvider, signInWithPopup, User } from '@angular/fire/auth';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthFirebaseService {
  private auth: Auth = inject(Auth);
  authState$ = authState(this.auth);
  authStateSubscription: Subscription;

  constructor() {
    this.authStateSubscription = this.authState$.subscribe((aUser: User | null) => {
        //handle auth state changes here. Note, that user will be null if there is no currently logged in user.
     console.log(aUser);
    })
  }

  ngOnDestroy() {
    // when manually subscribing to an observable remember to unsubscribe in ngOnDestroy
    this.authStateSubscription.unsubscribe();
  }

  login(): void {
    this.loginInWithGoogle();
  }

  loginInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  register(): void {

  }

  logout(): void {
    this.auth.signOut();
  }

}
