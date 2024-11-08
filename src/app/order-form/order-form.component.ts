import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { EmailValidator, FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../services/order.service';
import { Order, Product } from '../models/models';
import { uniqueProductValidator } from '../validators/uniqueProdValidator';
import { canBuy } from '../validators/emailValidator';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css'
})
export class OrderFormComponent {

  products: any[] = [];
  selectedProducts: any[] = [];

  order : Order = {
    id: '',
    customerName: '',
    email: '',
    orderCode: '',
    products: [],
    timestamp: '',
    total: 0
  }

  private orderService = inject(OrderService);


  orderForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email], [canBuy(this.orderService)]),

    productsArray: new FormArray([], [Validators.required, uniqueProductValidator])
  });

  get productsArray() {
    return this.orderForm.controls['productsArray'] as FormArray;
  }

  addProdForm() {
    const productForm : FormGroup = new FormGroup({
      prodName: new FormControl('', [Validators.required]),
      quantity: new FormControl(1, [Validators.required, Validators.min(1)]), // falta validar que no sea mayor que el stock
      price: new FormControl(0, [Validators.required]),
      stock: new FormControl(0, [Validators.required]),
    })
    
    this.productsArray.push(productForm);
  }

  remove(index: number) {
    this.productsArray.removeAt(index);
  }


  ngOnInit() {
    this.orderService.getProducts().subscribe({
      next: (response) => {
        console.log(response);
        this.products = response;
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  selectProd(event: any, index: number) {
    console.log(event.target.value);
    const prodId = event.target.value;
    console.log(prodId)
    const product = this.products.find(prod => prod.id === prodId);
    console.log(product)
    if(product) {
      this.selectedProducts[index] = product;
    }

    this.productsArray.controls[index].patchValue({
      price: this.selectedProducts[index].price,
      stock: this.selectedProducts[index].stock
    });

    this.productsArray.controls[index].get('quantity')?.addValidators(Validators.max(this.selectedProducts[index].stock));
  }

  sendForm() {
    console.log("enviando form");

    if(this.productsArray.controls.length == 0) {
      console.log("Elegir al menos un producto");
    }

    let orderTotal = 0;
    let orderProducts = [];
    
    for (const prod of this.productsArray.controls) {
      
      orderTotal += prod.get('quantity')?.value * prod.get('price')?.value;

      
      orderProducts.push({
        productId: prod.get('prodName')?.value,
        price: prod.get('price')?.value,
        quantity: prod.get('quantity')?.value,
        stock: prod.get('stock')?.value
      })
    }

    if(orderTotal > 1000) {
      orderTotal = orderTotal * 0.9;
    }
    orderTotal.toFixed(3)

    let code = this.orderForm.controls['name'].value[0] + this.orderForm.controls['email'].value.slice(-4); // ultimos 4 caracteres
    code += new Date().toISOString();

    if(this.orderForm.valid) {
      console.log(this.orderForm.value);

      this.order = {
        customerName: this.orderForm.controls['name'].value,
        email: this.orderForm.controls['email'].value,
        orderCode: code,
        products: orderProducts,
        timestamp: new Date().toISOString(),
        total: parseFloat(orderTotal.toFixed(3))
      }

      console.log(this.order);

      this.orderService.createOrder(this.order).subscribe({
        next: (response) => {
          console.log(response);

          // debería actualizar el stock de los productos
        },
        error: (error => { console.error(error); })
      });
    } else {
      this.orderForm.markAllAsTouched();
      console.log(this.orderForm.errors);
    }
    
  }

}
