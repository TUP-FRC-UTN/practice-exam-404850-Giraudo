import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from "@angular/forms";
import { OrderService } from "../services/order.service";
import { catchError, map, Observable, of, tap } from "rxjs";


export function canBuy(orderService: OrderService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {

        if (!control.parent) {
            return of(null);
        }

        const email = control.parent.get('email')?.value;

        if (!email) {
            return of(null);
        }

        return orderService.getOrdersByEmail(email).pipe(
            tap((orders) => {
                console.log(orders);
                
            }),
            map(orders => {

                // filtro las ult 24 hs
                const recentOrders = orders.filter(order => {
                    const orderDate = order.timestamp ? new Date(order.timestamp) : new Date();

                    const difference = (new Date().getTime() - orderDate.getTime());
                    
                    return difference <= 24*60*60*1000;
                })

                if(recentOrders.length >= 3) {
                    return { limit: true };
                }

                return null;
            }),
            catchError((error) => {
                console.error("error al validar limite de pedidos: ", error)
                return of(null)
            })
        )
      
    };
  }