import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriesService } from '../../service/categories/categories';
import { Category } from '../../../Models/category';

@Component({
  selector: 'app-category-add',
  imports: [FormsModule],
  templateUrl: './category-add.html',
  styleUrl: './category-add.scss',
})
export class CategoryAdd {
  private readonly router = inject(Router);
  private readonly categoriesService = inject(CategoriesService);
  category: Category = { name: '', description: '' };

  save() {
    this.categoriesService.create(this.category).subscribe({
      next: () => this.goBack()
    });
  }

  goBack() {
    this.router.navigate(['/admin/categories']);
  }
}
