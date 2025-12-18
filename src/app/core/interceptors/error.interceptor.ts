import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../components/service/auth/auth';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return next(req).pipe(
        catchError(error => {
            // Error 401: Token inválido o expirado - logout automático
            if (error.status === 401) {
                if (req.url.includes('/auth/login')) {
                    // El componente login ya maneja sus propios errores
                } else {
                    console.error('Sesión expirada o token inválido');
                    authService.clearSession();
                    router.navigate(['/admin/login']);
                    alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
                }
            }

            // Error 403: Sin permisos
            if (error.status === 403) {
                console.error('Acceso denegado:', error);
                alert('No tienes permisos para realizar esta acción');
            }

            // Error 500: Error del servidor
            if (error.status === 500) {
                console.error('Error del servidor:', error);
                alert('Error del servidor. Por favor, intenta más tarde.');
            }

            // Error de red (sin conexión)
            if (error.status === 0) {
                console.error('Error de conexión:', error);
                alert('No se pudo conectar con el servidor. Verifica tu conexión.');
            }

            return throwError(() => error);
        })
    );
};
