import { Component, inject, OnInit } from '@angular/core';
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
export class CategoryEdit implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly categoriesService = inject(CategoriesService);
  category: Category = { name: '', description: '' };



  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.categoriesService.getById(id).subscribe({
        next: data => {
          this.category = data;
        },
        error: () => {
          this.goBack();
        }
      });
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
