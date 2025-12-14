import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../service/categories/categories';
import { Category } from '../../../Models/category';

@Component({
  selector: 'app-categories',
  imports: [RouterLink],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  categories: Category[] = [];

  ngOnInit() {
    this.load();
  }

  load() {
    this.categoriesService.getAll().subscribe({
      next: data => {
        this.categories = data;
      },
      error: err => {
        console.error('Error cargando categorías:', err);
        alert('Error al cargar las categorías');
      }
    });
  }

  remove(id: number) {
    if (confirm('¿Eliminar esta categoría?')) {
      this.categoriesService.delete(id).subscribe({
        next: () => this.load(),
        error: err => {
          console.error('Error eliminando categoría:', err);
          alert('Error al eliminar la categoría');
        }
      });
    }
  }
}
