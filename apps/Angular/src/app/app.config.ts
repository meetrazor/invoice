import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { authInterceptor } from './interceptor/auth/auth.interceptor';
import { errorInterceptor } from './interceptor/error/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: 'none',
          prefix: '',
          cssLayer: {
            name: 'primeng',
            order: 'app-styles, primeng',
          },
        },
      },
    }),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    MessageService,
  ],
};
