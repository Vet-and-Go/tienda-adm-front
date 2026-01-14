import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriesService } from '../../service/categories/categories';
import { Category } from '../../../Models/category';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './category-add.html',
  styleUrl: './category-add.scss',
})
export class CategoryAdd implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly categoriesService = inject(CategoriesService);
  private readonly router = inject(Router);

  categoryForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  ngOnInit(): void {
  }

  save() {
    if (this.categoryForm.valid) {
      const formValue = this.categoryForm.value;
      const newCategory: Category = {
        name: formValue.name!,
        description: formValue.description!,
      };
      this.categoriesService.create(newCategory).subscribe({
        next: () => {
          alert('Category added successfully!');
          this.router.navigate(['/admin/categories']);
        },
        error: (err) => {
          console.error('Error adding category:', err);
          alert('Error adding category');
        },
      });
    } else {
      alert('Please fill all required fields.');
    }
  }

  cancel() {
    this.router.navigate(['/admin/categories']);
  }
}
