import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  username = '';
  password = '';
  isLoading = false;

  onSubmit(): void {
    this.isLoading = true;

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        console.error('Error en login:', err);
        this.isLoading = false;
        const message = err.status === 401
          ? 'Usuario o contraseña incorrectos'
          : 'Error de conexión con el servidor';
        alert(message);
      }
    });
  }
}
