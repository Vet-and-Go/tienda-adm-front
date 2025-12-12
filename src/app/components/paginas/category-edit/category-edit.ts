import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../service/categories/categories';
import { Category } from '../../../Models/category';

@Component({
  selector: 'app-category-edit',
  imports: [CommonModule, FormsModule],
  templateUrl: './category-edit.html',
  styleUrl: './category-edit.scss',
})
export class CategoryEdit implements OnInit {
  category: Category = {
    id: 0,
    name: '',
    description: ''
  };
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.categoriesService.getById(id).subscribe({
        next: (category) => {
          this.category = category;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading category:', error);
          this.isLoading = false;
          alert('Error al cargar la categoría');
          this.router.navigate(['/categories']);
        }
      });
    }
  }

  saveCategory() {
    if (!this.category.name || !this.category.description) {
      alert('Todos los campos son obligatorios');
      return;
    }

    this.categoriesService.update(this.category).subscribe({
      next: () => {
        
        this.router.navigate(['/categories']);
      },
      error: (error) => {
        console.error('Error updating category:', error);
        alert('Error al actualizar la categoría');
      }
    });
  }

  cancel() {
    this.router.navigate(['/categories']);
  }
}
