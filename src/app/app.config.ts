// Angular
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';

// Third party
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { CookieService } from 'ngx-cookie-service';

// Local
import { ROUTES as routes } from './app.routes';
import { loggingInterceptor } from './utils/interceptors/logging.interceptor';
import { headerInterceptor } from './utils/interceptors/header.interceptor';
import { errorInterceptor } from './utils/interceptors/error.interceptor';
import { STORE_TOKEN, STORE } from './data-access/state/state.store';
import { environment } from '.././app/environment/environment';


const INTERCEPTORS = [
  provideHttpClient(
    withInterceptors([
      loggingInterceptor,
      headerInterceptor,
      errorInterceptor
    ]),
  )
];

export const appConfig: ApplicationConfig = {
  providers: [
    ...INTERCEPTORS,
    CookieService,
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules)
    ),
    provideHttpClient(withFetch()), provideAnimationsAsync(),
    { provide: STORE_TOKEN, useValue: STORE },
    provideAnimations(),
    importProvidersFrom(
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      })
    ),
    provideFirebaseApp(() => initializeApp({
      projectId: environment.appId,
      appId: environment.appId,
      storageBucket: environment.storageBucket,
      apiKey: environment.apiKey,
      authDomain: environment.authDomain,
      messagingSenderId: environment.messagingSenderId
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ]
};
