import { Component, OnInit, OnDestroy, inject, computed } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../service/categories/categories';
import { AuthService } from '../../service/auth/auth';

interface DashboardStats {
  totalCategories: number;
  totalProducts: number;
  totalUsers: number;
}

@Component({
  selector: 'app-inicio',
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio implements OnInit, OnDestroy {
  /* Services */
  readonly categories = inject(CategoriesService);
  readonly auth = inject(AuthService);

  /* State */
  currentTime: string = '';

  stats: DashboardStats = {
    totalCategories: 0,
    totalProducts: 0,
    totalUsers: 0
  };

  loading: boolean = true;
  private intervalId: any;
  private subscription: Subscription | null = null;

  ngOnInit() {
    this.loadDashboardData();
    this.updateTime();
    this.intervalId = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  loadDashboardData() {
    this.loading = true;

    this.subscription = this.categories.getAll().subscribe({
      next: categories => {
        this.stats.totalCategories = categories.length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    this.stats.totalProducts = 0;
    this.stats.totalUsers = 1;
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
  }


}

