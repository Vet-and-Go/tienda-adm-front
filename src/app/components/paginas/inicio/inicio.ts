import { Component, OnInit, inject, computed } from '@angular/core';
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
export class Inicio implements OnInit {
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

  ngOnInit() {
    this.loadDashboardData();
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  loadDashboardData() {
    this.loading = true;

    this.categories.getAll().subscribe({
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

