import { renderHook, act } from '@testing-library/react';
import { useCart } from './useCart';
import { Product } from '@/types/Product';
import { useLocalStorage } from '../useLocalStorage/useLocalStorage';

jest.mock('../useLocalStorage/useLocalStorage', () => ({
  useLocalStorage: jest.fn(),
}));

describe('useCart', () => {
  let setValueMock: jest.Mock;

  const initialCartState = { products: [] };

  const mockProduct: Product = {
    id: 1,
    name: 'Sneaker',
    price: 100,
    images: [
      {
        id: 1,
        url: '/shoe.png',
        name: 'image',
        alternativeText: '',
        caption: '',
        width: 100,
        height: 100,
        formats: {},
        hash: '',
        ext: '',
        mime: '',
        size: 0,
        previewUrl: null,
        provider: '',
        provider_metadata: { public_id: 'public-id', resource_type: 'image' },
        createdAt: '',
        updatedAt: '',
      },
    ],
    gender: { id: 3, name: '', createdAt: '', updatedAt: '', publishedAt: '' },
    color: { id: 2, name: '', createdAt: '', updatedAt: '', publishedAt: '' },
    brand: {
      id: 1,
      name: 'Nike',
      createdAt: '',
      updatedAt: '',
      publishedAt: '',
    },
    description: 'Test description',
    sizes: [
      { id: 1, value: 35, createdAt: '', updatedAt: '', publishedAt: '' },
    ],
    categories: [
      { id: 1, name: 'Shoes', createdAt: '', updatedAt: '', publishedAt: '' },
      {
        id: 2,
        name: 'Sportswear',
        createdAt: '',
        updatedAt: '',
        publishedAt: '',
      },
    ],
  };

  beforeEach(() => {
    setValueMock = jest.fn();
    (useLocalStorage as jest.Mock).mockReturnValue({
      value: initialCartState,
      setValue: setValueMock,
      isLoading: false,
    });
    jest.clearAllMocks();
  });

  it('adds an item to the cart', () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.addItem(mockProduct, 42);
    });
    expect(setValueMock).toHaveBeenCalledWith({
      ...initialCartState,
      products: expect.arrayContaining([
        expect.objectContaining({
          id: mockProduct.id,
          size: 42,
          quantity: 1,
        }),
      ]),
    });
  });

  it('updates quantity of an item', () => {
    const cartWithItem = {
      products: [
        {
          id: 1,
          name: 'Sneaker',
          price: 100,
          size: 42,
          image: '/shoe.png',
          quantity: 1,
          gender: 'Unisex',
          color: 'Red',
        },
      ],
    };
    (useLocalStorage as jest.Mock).mockReturnValue({
      value: cartWithItem,
      setValue: setValueMock,
      isLoading: false,
    });
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.updateQuantity(1, 42, 3);
    });
    expect(setValueMock).toHaveBeenCalledWith({
      ...cartWithItem,
      products: [
        expect.objectContaining({
          id: 1,
          size: 42,
          quantity: 3,
        }),
      ],
    });
  });

  it('removes item when quantity < 1', () => {
    const cartWithItem = {
      products: [
        {
          id: 1,
          name: 'Sneaker',
          price: 100,
          size: 42,
          image: '/shoe.png',
          quantity: 1,
          gender: 'Unisex',
          color: 'Red',
        },
      ],
    };
    (useLocalStorage as jest.Mock).mockReturnValue({
      value: cartWithItem,
      setValue: setValueMock,
      isLoading: false,
    });
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.updateQuantity(1, 42, 0);
    });
    expect(setValueMock).toHaveBeenCalledWith({
      ...cartWithItem,
      products: [],
    });
  });

  it('increaseQuantity calls updateQuantity with +1', () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.increaseQuantity(1, 42, 2);
    });
    expect(setValueMock).toHaveBeenCalled();
  });

  it('decreaseQuantity calls updateQuantity with -1', () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.decreaseQuantity(1, 42, 2);
    });
    expect(setValueMock).toHaveBeenCalled();
  });

  it('removes item from the cart', () => {
    const cartWithItems = {
      products: [
        {
          id: 1,
          size: 42,
          quantity: 1,
          name: 'Sneaker',
          price: 100,
          image: '/shoe.png',
          gender: 'Unisex',
          color: 'Red',
        },
        {
          id: 2,
          size: 40,
          quantity: 1,
          name: 'Boot',
          price: 200,
          image: '/boot.png',
          gender: 'Unisex',
          color: 'Black',
        },
      ],
    };
    (useLocalStorage as jest.Mock).mockReturnValue({
      value: cartWithItems,
      setValue: setValueMock,
      isLoading: false,
    });
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.removeItem(1, 42);
    });
    expect(setValueMock).toHaveBeenCalledWith({
      ...cartWithItems,
      products: [expect.objectContaining({ id: 2 })],
    });
  });

  it('sets and clears discount', () => {
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.setDiscount('SAVE10', 10, 'percent');
    });
    expect(setValueMock).toHaveBeenCalledWith(
      expect.objectContaining({
        discountCode: 'SAVE10',
        discountAmount: 10,
        discountType: 'percent',
      })
    );
    act(() => {
      result.current.clearDiscount();
    });
    expect(setValueMock).toHaveBeenCalledWith(
      expect.objectContaining({
        discountCode: undefined,
        discountAmount: undefined,
        discountType: undefined,
      })
    );
  });

  it('clears the cart', () => {
    const cartWithItems = {
      products: [
        {
          id: 1,
          size: 42,
          quantity: 1,
          name: 'Sneaker',
          price: 100,
          image: '/shoe.png',
          gender: 'Unisex',
          color: 'Red',
        },
      ],
    };
    (useLocalStorage as jest.Mock).mockReturnValue({
      value: cartWithItems,
      setValue: setValueMock,
      isLoading: false,
    });
    const { result } = renderHook(() => useCart());
    act(() => {
      result.current.clearCart();
    });
    expect(setValueMock).toHaveBeenCalledWith({
      products: [],
      discountCode: undefined,
      discountAmount: undefined,
      discountType: undefined,
    });
  });

  it('computes subtotal and total correctly', () => {
    const cartWithItems = {
      products: [
        {
          id: 1,
          size: 42,
          quantity: 2,
          price: 50,
          name: 'Sneaker',
          image: '/shoe.png',
          gender: 'Unisex',
          color: 'Red',
        },
        {
          id: 2,
          size: 40,
          quantity: 1,
          price: 100,
          name: 'Boot',
          image: '/boot.png',
          gender: 'Unisex',
          color: 'Black',
        },
      ],
    };
    (useLocalStorage as jest.Mock).mockReturnValue({
      value: cartWithItems,
      setValue: setValueMock,
      isLoading: false,
    });
    const { result } = renderHook(() => useCart());
    expect(result.current.subtotal).toBe(200);
    expect(result.current.getTotal(20, 10)).toBeCloseTo((200 + 20) * 1.1);
  });

  it('resets discount if fixed discount > 50% subtotal', () => {
    const cartWithItems = {
      products: [
        {
          id: 1,
          size: 42,
          quantity: 1,
          price: 100,
          name: 'Sneaker',
          image: '/shoe.png',
          gender: 'Unisex',
          color: 'Red',
        },
      ],
      discountCode: 'BIG',
      discountAmount: 60,
      discountType: 'fixed',
    };
    (useLocalStorage as jest.Mock).mockReturnValue({
      value: cartWithItems,
      setValue: setValueMock,
      isLoading: false,
    });
    const { result } = renderHook(() => useCart());
    expect(result.current.discountAmount).toBe(0);
  });
});
