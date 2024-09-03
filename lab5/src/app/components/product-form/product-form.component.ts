import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  productId: any;
  constructor(
    private productService: ProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (response) => {
        this.productId = response['id'];
        this.getName.setValue('');
        this.getPrice.setValue('');
        this.getQuantity.setValue('');
        this.getRating.setValue('');
      },
    });
    if (this.productId != 0) {
      this.productService.getProductById(this.productId).subscribe({
        next: (response) => {
          this.getName.setValue(response.name);
          this.getPrice.setValue(response.price.toString());
          this.getQuantity.setValue(response.quantity.toString());
          this.getRating.setValue(response.rating?.toString() || '');
        },
      });
    }
  }
  productForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    price: new FormControl('', [Validators.required]),
    quantity: new FormControl('', Validators.required),
    rating: new FormControl('', [Validators.required, Validators.min(1), Validators.max(5)])
  });
  get getName() {
    return this.productForm.controls['name'];
  }
  get getPrice() {
    return this.productForm.controls['price'];
  }
  get getQuantity() {
    return this.productForm.controls['quantity'];
  }
  get getRating() {
    return this.productForm.controls['rating'];
  }
  productHandler(e: any) {
    e.preventDefault();
    this.productForm.markAllAsTouched(); // Mark all form controls as touched
    if (this.productForm.valid) {
      if (this.productId == 0) {
        this.productService.addNewProduct(this.productForm.value).subscribe({
          next: () => {
            this.router.navigate(['/products']);
          },
        });
      } else {
        this.productService
          .editProduct(this.productId, this.productForm.value)
          .subscribe({
            next: () => {
              this.router.navigate(['/products']);
            },
          });
      }
    } else {
      console.log('Errors');
    }
  }

}
