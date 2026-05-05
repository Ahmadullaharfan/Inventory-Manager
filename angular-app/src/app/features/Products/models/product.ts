export interface Product {
  id?: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  product_category_id?: number | null;
  category_name?: string | null;
}
