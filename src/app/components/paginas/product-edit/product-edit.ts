import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../service/products/products';
import { Product } from '../../../Models/product';
import { CategoriesService } from '../../service/categories/categories';
import { Category } from '../../../Models/category';
import { CommonModule } from '@angular/common';
import { filter, forkJoin, switchMap, tap } from 'rxjs';

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
  productId!: number;
  categoryName: string = 'Category';

  productForm = this.formBuilder.group({
    id: [null as number | null],
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    category: [null as Category | null, Validators.required],
  });

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        filter((params) => params.has('id')),
        switchMap((params) => {
          this.productId = Number(params.get('id'));
          console.log('Cargando datos para producto ID:', this.productId);

          // Cargamos categorías y producto en paralelo para mayor robustez
          return forkJoin({
            categories: this.categoriesService.getAll(),
            product: this.productService.getById(this.productId!)
          });
        })
      )
      .subscribe({
        next: ({ categories, product }) => {
          console.log('Categorías cargadas:', categories.length);
          console.log('Producto cargado:', product);

          this.categories = categories;

          const productCatId = typeof product.category === 'object' && product.category
            ? (product.category as Category).id
            : product.category;

          const categoryObj = this.categories.find(cat => cat.id === productCatId) || null;

          this.productForm.patchValue({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            category: categoryObj,
          });
        },
        error: (err: any) => {
          console.error('Error FATAL en la carga:', err);
          if (err.status === 500) {
            console.error('El servidor falló al procesar la petición. Revisa los logs de Java.');
          }
          alert('Error al cargar los datos del producto');
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
      this.productService.update(updatedProduct).subscribe({
        next: () => {
          alert('Producto actualizado con éxito');
          this.router.navigate(['/admin/products']);
        },
        error: (err: any) => {
          console.error('Error al actualizar:', err);
          alert('Error al actualizar el producto');
        },
      });
    } else {
      alert('Por favor, rellena todos los campos correctamente.');
    }
  }

  cancel() {
    this.router.navigate(['/admin/products']);
  }

  compareCat(c1: Category, c2: Category): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}
