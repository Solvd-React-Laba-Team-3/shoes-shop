import ProductForm, {
  ProductFormData,
} from '@/components/ui/ProductPage/ProductForm';

export default function AddPage() {
  const handleAdd = (data: ProductFormData) => {
    console.log('Add submitted: ', data);
  };

  return <ProductForm onSubmit={handleAdd} />;
}
