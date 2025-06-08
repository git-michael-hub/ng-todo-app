// Angular
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';

// Third party
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

// Local
import { ROUTES as routes } from './app.routes';
import { loggingInterceptor } from './utils/interceptors/logging.interceptor';
import { headerInterceptor } from './utils/interceptors/header.interceptor';
import { errorInterceptor } from './utils/interceptors/error.interceptor';
import { STORE_TOKEN, STORE } from './data-access/state/state.store';


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
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()), provideAnimationsAsync(),
    { provide: STORE_TOKEN, useValue: STORE },
    provideAnimations(),
    importProvidersFrom(
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      })
    ),
  ]
};
