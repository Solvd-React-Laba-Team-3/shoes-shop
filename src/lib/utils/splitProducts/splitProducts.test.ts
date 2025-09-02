import { splitProducts } from './splitProducts';
import { CartProduct } from '@/types/CartProduct';

const makeProduct = (id: number, size = 10): CartProduct =>
  ({
    id,
    name: 'x'.repeat(size), // controla tamanho da string
  }) as CartProduct;

describe('splitProducts', () => {
  it('should return empty array when no products', () => {
    const result = splitProducts([]);
    expect(result).toEqual({ products: [], omitted: false });
  });

  it('should put all products in one chunk if under maxChars', () => {
    const products = [makeProduct(1), makeProduct(2)];
    const result = splitProducts(products, 500);
    expect(result.omitted).toBe(false);
    expect(result.products.length).toBe(1);
    expect(JSON.parse(result.products[0])).toHaveLength(2);
  });

  it('should omit a product larger than maxChars', () => {
    const big = makeProduct(1, 1000);
    const result = splitProducts([big], 100);
    expect(result.products).toHaveLength(0);
    expect(result.omitted).toBe(true);
  });

  it('should split into multiple chunks when exceeding maxChars', () => {
    const products = [
      makeProduct(1, 200),
      makeProduct(2, 200),
      makeProduct(3, 200),
    ];
    const result = splitProducts(products, 300);
    expect(result.products.length).toBeGreaterThan(1);
    expect(result.omitted).toBe(false);
  });

  it('should respect maxChunks limit', () => {
    const products = [
      makeProduct(1, 200),
      makeProduct(2, 200),
      makeProduct(3, 200),
    ];
    const result = splitProducts(products, 300, 1); // só permite 1 chunk
    expect(result.products).toHaveLength(1);
    expect(result.omitted).toBe(true); // o resto foi cortado
  });

  it('should add last chunk if not empty', () => {
    const products = [makeProduct(1, 200), makeProduct(2, 200)];
    const result = splitProducts(products, 300);
    expect(
      JSON.parse(result.products[result.products.length - 1])
    ).toHaveLength(1);
  });

  it('should omit final chunk if maxChunks reached', () => {
    const products = [
      makeProduct(1, 50),
      makeProduct(2, 50),
      makeProduct(3, 50),
    ];
    const result = splitProducts(products, 100, 1);
    expect(result.products).toHaveLength(1);
    expect(result.omitted).toBe(true);
  });
});
