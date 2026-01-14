import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from '../../service/categories/categories';
import { Category } from '../../../Models/category';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './category-edit.html',
  styleUrl: './category-edit.scss',
})
export class CategoryEdit implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly categoriesService = inject(CategoriesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  categoryId!: number;

  categoryForm = this.formBuilder.group({
    id: [null as number | null],
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.categoryId = Number(id);
      this.categoriesService.getById(this.categoryId).subscribe({
        next: (data) => {
          this.categoryForm.patchValue({
            id: data.id,
            name: data.name,
            description: data.description,
          });
        },
        error: (err: any) => {
          console.error('Error loading category:', err);
          alert('Error loading category');
          this.cancel();
        },
      });
    }
  }

  save() {
    if (this.categoryForm.valid && this.categoryId) {
      const formValue = this.categoryForm.value;
      const updatedCategory: Category = {
        id: this.categoryId,
        name: formValue.name!,
        description: formValue.description!,
      };
      this.categoriesService.update(updatedCategory).subscribe({
        next: () => {
          alert('Category updated successfully');
          this.router.navigate(['/admin/categories']);
        },
        error: (err: any) => {
          console.error('Error updating category:', err);
          alert('Error updating category');
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
