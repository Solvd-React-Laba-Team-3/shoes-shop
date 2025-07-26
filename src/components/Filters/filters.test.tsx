import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Filters } from '@/components/Filters';
import { useSearchsParams } from '@/lib/hooks';
import { useSuspenseQueries } from '@tanstack/react-query';

jest.mock('@/lib/hooks', () => ({
  useSearchsParams: jest.fn(),
  useDebounce: jest.fn((v) => v),
}));

jest.mock('@tanstack/react-query', () => ({
  useSuspenseQueries: jest.fn(),
}));

jest.mock('@/api/gender/getGendersOptions', () => ({
  getGendersOptions: jest.fn(() => ({
    queryKey: ['gender'],
    queryFn: jest.fn(),
  })),
}));

jest.mock('@/api/size/getSizesOptions', () => ({
  getSizesOptions: jest.fn(() => ({ queryKey: ['size'], queryFn: jest.fn() })),
}));

jest.mock('@/api/color/getColorsOptions', () => ({
  getColorsOptions: jest.fn(() => ({
    queryKey: ['color'],
    queryFn: jest.fn(),
  })),
}));

jest.mock('@/api/brand/getBrandsOptions', () => ({
  getBrandsOptions: jest.fn(() => ({
    queryKey: ['brand'],
    queryFn: jest.fn(),
  })),
}));

describe('<Filters />', () => {
  const mockSet = jest.fn();
  const mockDelete = jest.fn();
  const mockSearchParams = {
    set: mockSet,
    delete: mockDelete,
    get: jest.fn(() => 'Test'),
  };

  beforeEach(() => {
    (useSearchsParams as jest.Mock).mockReturnValue(mockSearchParams);
    (useSuspenseQueries as jest.Mock).mockReturnValue([
      { data: [{ id: 1, name: 'Men' }] },
      { data: [{ id: 1, value: '42' }] },
      { data: [{ id: 1, name: 'Nike' }] },
      { data: [{ id: 1, name: 'Red' }] },
    ]);
    mockSet.mockClear();
    mockDelete.mockClear();
  });

  it('renders section titles and search text', () => {
    render(<Filters />);
    expect(screen.getByText(/Shoes\/Test/i)).toBeInTheDocument();
    expect(screen.getByText('Gender')).toBeInTheDocument();
    expect(screen.getByText('Brand')).toBeInTheDocument();
    expect(screen.getByText('Color')).toBeInTheDocument();
    expect(screen.getByText('Size')).toBeInTheDocument();
  });

  it('renders default title when search param is not present', () => {
    const mockSet = jest.fn();
    const mockDelete = jest.fn();
    const mockSearchParams = {
      set: mockSet,
      delete: mockDelete,
      get: jest.fn(() => null),
    };

    (useSearchsParams as jest.Mock).mockReturnValue(mockSearchParams);

    render(<Filters />);
    expect(screen.queryByText(/Shoes\//i)).not.toBeInTheDocument();
    expect(screen.getByText('Catalog')).toBeInTheDocument();
  });

  it('renders filters options', () => {
    render(<Filters />);
    expect(screen.getByLabelText(/Men/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nike/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Red/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/42/i)).toBeInTheDocument();
  });

  it('updates query string on gender filter interaction', async () => {
    render(<Filters />);
    const genderCheckbox = screen.getByLabelText(/Men/i) as HTMLInputElement;
    fireEvent.click(genderCheckbox);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('filters');
      expect(mockSet).toHaveBeenCalledWith(
        expect.stringMatching('filters'),
        expect.any(String)
      );
    });
  });

  it('allows brand search', async () => {
    render(<Filters />);
    const searchInput = screen.getByPlaceholderText(/Search brand/i);
    fireEvent.change(searchInput, { target: { value: 'adidas' } });
    await waitFor(() => {
      expect(searchInput).toHaveValue('adidas');
    });
  });

  it('updates query string on brand filter interaction', async () => {
    render(<Filters />);
    const genderCheckbox = screen.getByLabelText(/Nike/i) as HTMLInputElement;
    fireEvent.click(genderCheckbox);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('filters');
      expect(mockSet).toHaveBeenCalledWith(
        expect.stringMatching('filters'),
        expect.any(String)
      );
    });
  });
  it('updates query string on size filter interaction', async () => {
    render(<Filters />);
    const genderCheckbox = screen.getByLabelText(/42/i) as HTMLInputElement;
    fireEvent.click(genderCheckbox);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('filters');
      expect(mockSet).toHaveBeenCalledWith(
        expect.stringMatching('filters'),
        expect.any(String)
      );
    });
  });
  it('updates query string on color filter interaction', async () => {
    render(<Filters />);
    const genderCheckbox = screen.getByLabelText(/Red/i) as HTMLInputElement;
    fireEvent.click(genderCheckbox);

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith('filters');
      expect(mockSet).toHaveBeenCalledWith(
        expect.stringMatching('filters'),
        expect.any(String)
      );
    });
  });

  it('changes price using textfields', async () => {
    render(<Filters />);

    const minInput = screen.getAllByTestId(
      'price-range'
    )[0] as HTMLInputElement;
    const maxInput = screen.getAllByTestId(
      'price-range'
    )[1] as HTMLInputElement;

    fireEvent.change(minInput, { target: { value: '10' } });
    fireEvent.change(maxInput, { target: { value: '9000' } });

    await waitFor(() => {
      expect(minInput.value).toBe('10');
      expect(maxInput.value).toBe('9000');
      expect(mockSet).toHaveBeenCalledWith(
        expect.stringMatching('filters'),
        expect.any(String)
      );
    });
  });
});
