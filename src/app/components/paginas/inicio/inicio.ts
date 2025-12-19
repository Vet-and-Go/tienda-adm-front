import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subscription, forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../service/categories/categories';
import { ProductsService } from '../../service/products/products';
import { AuthService } from '../../service/auth/auth';



@Component({
  selector: 'app-inicio',
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class Inicio implements OnInit, OnDestroy {
  /* Services */
  readonly categoriesService = inject(CategoriesService);
  readonly productsService = inject(ProductsService);
  readonly auth = inject(AuthService);

  /* State */
  currentTime: string = '';
  totalCategories: number = 0;
  totalProducts: number = 0;
  totalUsers: number = 1;
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

    this.subscription = forkJoin({
      categories: this.categoriesService.getAll(),
      productsPage: this.productsService.getAll(1, 1)
    }).subscribe({
      next: ({ categories, productsPage }) => {
        this.totalCategories = categories.length;
        this.totalProducts = productsPage.totalElements;
        this.totalUsers = 1;
      },
      error: (err) => {
        console.error('Error cargando datos del dashboard:', err);
      }
    });
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

