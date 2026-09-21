export interface ProductSuppliers {
  id?: number;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address?: string | null;
  country?: string | null;
  product_category_id: number | null;
  price: number;
  stock: number;
}