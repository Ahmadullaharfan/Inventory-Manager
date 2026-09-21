// features/Products/models/product.ts
export interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  location: string;
  image_url: string | null;
  cost_price: number | string; // Allow both number and string
  unit_of_measure: string;
  units_per_package: number;
  is_active: boolean;
  product_category_id: number;
  supplier_id: number;
  category?: {
    id: number;
    name: string;
    description: string | null;
  };
  supplier?: {
    id: number;
    name: string;
    contact_person: string;
    phone: string;
    email: string;
    address: string;
    country: string;
  };
  created_at: string;
  updated_at: string;
  category_name?: string; // Add this for the transformed data
}