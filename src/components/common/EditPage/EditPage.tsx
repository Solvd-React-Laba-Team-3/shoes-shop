import ProductForm from '@/components/ui/ProductPage/ProductForm';
import type { ProductFormData } from '@/components/ui/ProductPage/ProductForm';

export default function EditPage() {
  const handleEdit = (data: ProductFormData) => {
    console.log('Edit submitted:', data);
  };

  return (
    <ProductForm
      defaultValues={{
        productName: 'Nike Air Max 90',
        price: '$160',
        gender: 'Male',
        color: 'Black',
        brand: 'Nike',
        description:
          "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book. It usually begins with",
        size: ['EU-38', 'EU-39'],
      }}
      onSubmit={handleEdit}
    />
  );
}
