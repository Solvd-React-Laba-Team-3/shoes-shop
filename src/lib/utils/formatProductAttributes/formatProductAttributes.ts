import { Product } from '@/types/Product';
import { ProductAttributes } from '@/types/api/ProductAttributes';

/**
 * Converts a Strapi Product API response (`ProductAttributes`) into a clean `Product` domain model.
 *
 * This function flattens Strapi's nested `data` and `attributes` structure into a
 * directly usable product object for the application.
 *
 * @example
 * const product = formatProductAttributes(strapiProduct.id, strapiProduct.attributes);
 * console.log(product.name); // "Nike Shoes"
 * console.log(product.images[0].url); // "/uploads/image.jpg"
 *
 * @param id - Product ID returned by Strapi.
 * @param attributes - The product attributes object returned by Strapi.
 * @returns A clean, strongly typed `Product` object suitable for UI and business logic.
 */
export const formatProductAttributes = (
  id: number,
  attributes: ProductAttributes
): Product => {
  return {
    id,
    name: attributes.name,
    description: attributes.description,
    price: attributes.price,
    teamName: attributes.teamName,
    images:
      attributes.images.data?.map((img) => ({
        ...img.attributes,
      })) || null,
    brand: attributes.brand.data?.attributes,
    categories:
      attributes.categories.data?.map((cat) => ({ ...cat.attributes })) || null,
    color: attributes.color.data?.attributes,
    gender: attributes.gender.data?.attributes,
    sizes: attributes.sizes.data?.map((size) => ({
      ...size.attributes,
    })),
  };
};
