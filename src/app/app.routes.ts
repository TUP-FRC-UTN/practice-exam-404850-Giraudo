import { Routes } from '@angular/router';
import { OrderFormComponent } from './order-form/order-form.component';
import { OrderListComponent } from './order-list/order-list.component';

export const routes: Routes = [
    { path: 'create-order', component: OrderFormComponent },
    { path: 'orders', component: OrderListComponent },
    { path: '', redirectTo: '/create-order', pathMatch: 'full'}
];
