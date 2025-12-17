import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../service/products/products';
import { Product } from '../../../Models/product';

@Component({
  selector: 'app-productos',
  imports: [RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  private readonly productService = inject(ProductsService);
  products: Product[] = [];
  pageNumber: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
  totalElements: number = 0;
  pages: number[] = [];

  ngOnInit() {
    this.load();
  }

  load() {
    this.productService.getAll(this.pageNumber, this.pageSize).subscribe({
      next: data => {
        this.products = data.data;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error: err => {
        console.error('Error while loading products:', err);
        alert('Error loading the products');
      }
    });
  }

  nextPage() {
    if (this.pageNumber < this.totalPages) { // Changed from totalPages - 1 to totalPages
      this.pageNumber++;
      this.load();
    }
  }

  previousPage() {
    if (this.pageNumber > 1) { // Changed from 0 to 1
      this.pageNumber--;
      this.load();
    }
  }

  goToPage(page: number) {
    this.pageNumber = page;
    this.load();
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
