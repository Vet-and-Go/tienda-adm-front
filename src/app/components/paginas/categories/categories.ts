import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CategoriesService } from '../../service/categories/categories';
import { Category } from '../../../Models/category';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnInit {
  categories: Category[] = [];

  constructor(
    private categoriesService: CategoriesService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Categories component initialized');
    this.updateCategoryList();
  }

  updateCategoryList() {
    console.log('Fetching categories...');
    this.categoriesService.getAll().subscribe({
      next: (categories) => {
        console.log('Categories received:', categories);
        this.categories = categories;
        console.log('Categories updated in component:', this.categories);
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error URL:', error.url);
      }
    });
  }

  removeCategory(id: number) {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      this.categoriesService.delete(id).subscribe(() => {
        this.updateCategoryList();
      });
    }
  }
}
