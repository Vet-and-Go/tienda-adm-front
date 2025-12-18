import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../service/categories/categories';
import { Category } from '../../../Models/category';

@Component({
  selector: 'app-category-edit',
  imports: [FormsModule],
  templateUrl: './category-edit.html',
  styleUrl: './category-edit.scss',
})
export class CategoryEdit implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly categoriesService = inject(CategoriesService);
  category: Category = { name: '', description: '' };
  private subscription: Subscription | null = null;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.subscription = this.categoriesService.getById(id).subscribe({
        next: data => {
          this.category = data;
        },
        error: err => {
          console.error('Error cargando categoría:', err);
          alert('Error al cargar la categoría');
          this.goBack();
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  save() {
    this.categoriesService.update(this.category).subscribe({
      next: () => this.goBack(),
      error: err => {
        console.error('Error actualizando categoría:', err);
        alert('Error al actualizar la categoría');
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/categories']);
  }
}
