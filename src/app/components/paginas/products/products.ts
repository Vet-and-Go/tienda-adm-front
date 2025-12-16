import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../service/products/products';
import { Product } from '../../../Models/product';

@Component({
  selector: 'app-productos',
  imports: [RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products {
  private readonly productService = inject(ProductsService);
  products: Product[] = [];

  ngOnInit() {
    this.load();
  }

  load() {
    this.productService.getAll().subscribe({
      next: data => {
        this.products = data;
      },
      error: err => {
        console.error('Error while loading products:', err);
        alert('Error loading the products');
      }
    });
  }

  remove(id: number) {
    if (confirm('Remove this Product?')) {
      this.productService.delete(id).subscribe({
        next: () => this.load(),
        error: err => {
          console.error('Something went during removal of the product', err);
          alert('Error removing the product');
        }
      });
    }
  }
}
