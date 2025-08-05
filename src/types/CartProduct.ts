export interface CartProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string[];
  color: { name: string };
  size: string;
  quantity: number;
}
