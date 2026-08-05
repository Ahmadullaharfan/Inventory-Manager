export interface Product {
  id?: number;
  name: string;
  description?: string;
  brand?: string;
  cost_price: number;
  unit_of_measure: string;
  units_per_package: number;
  location?: string;
  image?: string;
  is_active: boolean | number | string;
  product_category_id?: number | null;
  supplier_id?: number | null; 
  created_at?: string;
  updated_at?: string;
}