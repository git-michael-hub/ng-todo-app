import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { ROUTES as routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
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
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()), provideAnimationsAsync(),
    { provide: STORE_TOKEN, useValue: STORE }
  ]
};
