import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ToasterMessageService } from '../../services/message/message.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const alert = inject(ToasterMessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        alert.showError('Unauthorized access');
        router.navigate(['/login']); // Redirect to login page
      } else if (error.status === 403) {
        alert.showError('You do not have permission to perform this action.');
      }

      return throwError(() => error); // Propagate the error
    })
  );
};
