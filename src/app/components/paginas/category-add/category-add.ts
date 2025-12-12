import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriesService } from '../../service/categories/categories';
import { Category } from '../../../Models/category';

@Component({
  selector: 'app-category-add',
  imports: [CommonModule, FormsModule],
  templateUrl: './category-add.html',
  styleUrl: './category-add.scss',
})
export class CategoryAdd {
  category: Category = {
    id: 0,
    name: '',
    description: ''
  };

  constructor(
    private router: Router,
    private categoriesService: CategoriesService
  ) {}

  saveCategory() {
    if (!this.category.name || !this.category.description) {
      alert('Todos los campos son obligatorios');
      return;
    }

    this.categoriesService.create(this.category).subscribe({
      next: () => {
        this.router.navigate(['/categories']);
      },
      error: (error) => {
        console.error('Error creating category:', error);
        alert('Error al crear la categoría');
      }
    });
  }

  cancel() {
    this.router.navigate(['/categories']);
  }
}
