
export interface Product {
    productId: string;
    stock: number;
    quantity: number;
    price: number;
  }
  
export interface Order {
    id?: string;
    customerName: string;
    email: string;
    orderCode: string;
    products: Product[];
    timestamp: string;
    total: number;
  }
  