import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../service/categories/categories';
import { Category } from '../../../Models/category';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './category-edit.html',
  styleUrls: ['./category-edit.scss'],
})
export class CategoryEdit implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly categoriesService = inject(CategoriesService);
  private readonly formBuilder = inject(FormBuilder);

  category: Category = { name: '', description: '' };
  categoryForm: FormGroup;

  constructor() {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.categoriesService.getById(id).subscribe({
        next: (data) => {
          this.category = data;
          this.categoryForm.patchValue({
            name: this.category.name,
            description: this.category.description,
          });
        },
        error: (err) => {
          console.error('Error loading category:', err);
          alert('Error loading category');
          this.cancel();
        },
      });
    }
  }

  save() {
    if (this.categoryForm.valid) {
      const updatedCategory: Category = {
        id: this.category.id,
        ...this.categoryForm.value,
      };
      this.categoriesService.update(updatedCategory).subscribe({
        next: () => {
          alert('Category updated successfully');
          this.router.navigate(['/admin/categories']);
        },
        error: (err) => {
          console.error('Error updating category:', err);
          alert('Error updating category');
        },
      });
    }
  }

  cancel() {
    this.router.navigate(['/admin/categories']);
  }
}
