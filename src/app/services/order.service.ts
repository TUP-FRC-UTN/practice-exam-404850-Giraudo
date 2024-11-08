import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order, Product } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = "http://localhost:3000";

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any[]> {

    return this.http.get<any[]>(this.apiUrl + "/products");
  }

  getOrders(): Observable<Order[]> {

    return this.http.get<Order[]>(this.apiUrl + "/orders");
  }

  getOrdersByEmail(email: string): Observable<Order[]> {

    const params = new HttpParams().set('email', email)

    return this.http.get<Order[]>(this.apiUrl + "/orders", { params });
  }

  createOrder(order: Order): Observable<Order> {

    console.log("SERVICE", order);
    return this.http.post<Order>(this.apiUrl+ "/orders", order)
  }
}
