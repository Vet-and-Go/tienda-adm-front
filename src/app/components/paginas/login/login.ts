import { Component, inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnDestroy {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private subscription: Subscription | null = null;

  username = '';
  password = '';
  isLoading = false;

  onSubmit(): void {
    this.isLoading = true;

    this.subscription = this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          alert('Acceso denegado: No tienes permisos de administrador.');
          this.authService.clearSession();
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error Login:', err);
        this.isLoading = false;

        if (err.status === 401) {
          alert('Usuario o contraseña incorrectos');
        } else if (err.status === 500) {
          alert('Error del servidor. Por favor, intenta más tarde.');
        } else {
          alert('Error desconocido: ' + (err.error?.message || err.message || 'Inténtalo de nuevo'));
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
