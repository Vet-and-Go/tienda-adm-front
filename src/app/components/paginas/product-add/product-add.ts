import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '../../service/products/products';
import { Product } from '../../../Models/product';
import { CategoriesService } from '../../service/categories/categories';
import { Category } from '../../../Models/category';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-add.html',
  styleUrl: './product-add.scss',
})
export class ProductAdd implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly productService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly router = inject(Router);

  categories: Category[] = [];

  productForm = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    category: [null as number | null, Validators.required],
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoriesService.getAll().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        alert('Error loading categories');
      },
    });
  }

  saveProduct() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const categoryId = typeof formValue.category === 'object' && formValue.category
        ? (formValue.category as Category).id
        : formValue.category;
      const newProduct: Product = {
        name: formValue.name!,
        description: formValue.description!,
        price: formValue.price!,
        stock: formValue.stock!,
        category: categoryId!,
      };
      this.productService.create(newProduct).subscribe({
        next: () => {
          alert('Product added successfully!');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Error adding product:', err);
          alert('Error adding product');
        },
      });
    } else {
      alert('Please fill all required fields correctly.');
    }
  }

  cancel() {
    this.router.navigate(['/products']);
  }
}
