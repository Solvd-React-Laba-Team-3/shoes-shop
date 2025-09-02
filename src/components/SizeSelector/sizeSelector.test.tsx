import { render, screen } from '@testing-library/react';
import { SizeSelector } from './SizeSelector';
import { useSuspenseQuery } from '@tanstack/react-query';

jest.mock('@tanstack/react-query', () => ({
  useSuspenseQuery: jest.fn(),
}));

jest.mock('@/api/size/getSizesOptions', () => ({
  getSizesOptions: jest.fn(),
}));

describe('SizeSelector', () => {
  const mockSizes = [{ value: 36 }, { value: 38 }, { value: 40 }];

  beforeEach(() => {
    (useSuspenseQuery as jest.Mock).mockReturnValue({ data: mockSizes });
  });

  it('renders heading correctly', () => {
    render(
      <SizeSelector
        availableSizes={[36, 38]}
        selectedSize={null}
        onSizeChange={jest.fn()}
      />
    );
    expect(screen.getByText('Select Size')).toBeInTheDocument();
  });

  it('renders all toggle buttons with correct labels', () => {
    render(
      <SizeSelector
        availableSizes={[36, 38]}
        selectedSize={null}
        onSizeChange={jest.fn()}
      />
    );

    expect(
      screen.getByRole('button', { name: 'size EU 36' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'size EU 38' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'size EU 40' })
    ).toBeInTheDocument();
  });

  it('disables unavailable sizes', () => {
    render(
      <SizeSelector
        availableSizes={[36, 38]}
        selectedSize={null}
        onSizeChange={jest.fn()}
      />
    );

    const button36 = screen.getByRole('button', {
      name: 'size EU 36',
    }) as HTMLButtonElement;
    const button38 = screen.getByRole('button', {
      name: 'size EU 38',
    }) as HTMLButtonElement;
    const button40 = screen.getByRole('button', {
      name: 'size EU 40',
    }) as HTMLButtonElement;

    expect(button36.disabled).toBe(false);
    expect(button38.disabled).toBe(false);
    expect(button40.disabled).toBe(true);
  });
});
