import { Component, inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth/auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnDestroy {
  readonly auth = inject(AuthService);
  readonly router = inject(Router);
  subscription: Subscription | null = null;

  logout() {
    this.subscription = this.auth.logout().subscribe({
      complete: () => this.router.navigate(['/admin/login']),
      error: () => {
        this.auth.clearSession();
        this.router.navigate(['/admin/login']);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
