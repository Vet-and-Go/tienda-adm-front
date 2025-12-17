import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../service/products/products';
import { Product } from '../../../Models/product';
import { CategoriesService } from '../../service/categories/categories';
import { Category } from '../../../Models/category';
import { CommonModule } from '@angular/common';
import { filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.scss',
})
export class ProductEdit implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly productService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  categories: Category[] = [];
  productId: number | null = null;

  productForm = this.formBuilder.group({
    id: [null as number | null],
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    category: [null as number | null, Validators.required],
  });

  ngOnInit(): void {
    this.loadCategories();
    this.route.paramMap
      .pipe(
        filter((params) => params.has('id')),
        switchMap((params) => {
          this.productId = Number(params.get('id'));
          return this.productService.getById(this.productId);
        })
      )
      .subscribe({
        next: (product) => {
          this.productForm.patchValue({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: product.category,
          });
        },
        error: (err) => {
          console.error('Error loading product:', err);
          alert('Error loading product');
        },
      });
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
    if (this.productForm.valid && this.productId) {
      const formValue = this.productForm.value;
      const categoryId = typeof formValue.category === 'object' && formValue.category
        ? (formValue.category as Category).id
        : formValue.category;
      const updatedProduct: Product = {
        id: this.productId!,
        name: formValue.name!,
        description: formValue.description!,
        price: formValue.price!,
        stock: formValue.stock!,
        category: categoryId!,
      };
      this.productService.upate(updatedProduct).subscribe({
        next: () => {
          alert('Product updated successfully!');
          this.router.navigate(['/products']);
        },
        error: (err) => {
          console.error('Error updating product:', err);
          alert('Error updating product');
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
