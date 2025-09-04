import { renderHook, act } from '@testing-library/react';
import { useCart } from './useCart';
import { useLocalStorage } from '../useLocalStorage/useLocalStorage';
import { productMock } from '@/testing/mocks';

jest.mock('../useLocalStorage/useLocalStorage', () => ({
  useLocalStorage: jest.fn(),
}));

describe('useCart', () => {
  let setValueMock: jest.Mock;

  const initialCartState = { products: [] };

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
      result.current.addItem(productMock, 42);
    });
    expect(setValueMock).toHaveBeenCalledWith({
      ...initialCartState,
      products: expect.arrayContaining([
        expect.objectContaining({
          id: productMock.id,
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
