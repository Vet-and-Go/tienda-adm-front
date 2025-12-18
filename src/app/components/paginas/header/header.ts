import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth/auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  readonly auth = inject(AuthService);
  readonly router = inject(Router);

  logout() {
    this.auth.logout().subscribe({
      complete: () => this.router.navigate(['/admin/login']),
      error: () => {
        this.auth.clearSession();
        this.router.navigate(['/admin/login']);
      }
    });
  }
}
