import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit {

  orders : any[] = [];

  private orderService = inject(OrderService);

  
  search = new FormControl('',);

  ngOnInit() {

    this.getOrders()

    this.search.valueChanges.subscribe(() => {
      
      this.orders = this.filterOrders()
    })
  } 

  getOrders() {
    this.orderService.getOrders().subscribe({
      next: (response) => {
        console.log(response);
        this.orders = response;
      },
      error: (error) => {console.error(error)}
    })
  }

  filterOrders() {
    if(!this.search.value) {
      this.getOrders()
    }
    console.log("HOLAHOLA")
    return this.orders.filter(order => 
      order.customerName.toLowerCase().includes(this.search.value?.toLowerCase() ?? '') ||
      order.email.toLowerCase().includes(this.search.value?.toLowerCase() ?? '')
    )
  }

}
