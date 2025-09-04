import { screen, fireEvent } from '@testing-library/react';
import { Catalog } from './Catalog';
import { useSearchParams } from '@/lib/hooks';
import { render } from '@/testing/utils';
import { lazy } from 'react';

jest.mock('@/lib/hooks', () => ({
  useDeviceSize: jest.fn(),
  useSearchParams: jest.fn(),
}));

const useMediaQueryMock = jest.fn();
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: (query: string) => useMediaQueryMock(query),
}));

describe('Catalog Component', () => {
  beforeEach(() => {
    useMediaQueryMock.mockReturnValue(false);
    (useSearchParams as jest.Mock).mockImplementation(() => ({
      get: () => undefined,
    }));
  });

  it('opens Filters when toggled and shows FiltersFallback on desktop', () => {
    render(<Catalog />);

    fireEvent.click(screen.getByText('Toggle Filters'));

    expect(screen.getByText(/Open:true/i)).toBeInTheDocument();
  });

  it('closes Filters when onClose is called', () => {
    render(<Catalog />);

    fireEvent.click(screen.getByText('Toggle Filters'));
    expect(screen.getByText(/Open:true/)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close Filters'));
    expect(screen.queryByText(/Open:true/)).not.toBeInTheDocument();
  });

  it('renders FiltersFallback on desktop when Suspense is pending', () => {
    useMediaQueryMock.mockReturnValue(false);

    jest.mock('@/components/common/Filters', () => ({
      Filters: lazy(() => new Promise(() => {})),
    }));

    render(<Catalog />);

    expect(screen.queryByText('FiltersFallback')).not.toBeInTheDocument();
  });

  it('does not render FiltersFallback on mobile', () => {
    useMediaQueryMock.mockReturnValue(true);
    render(<Catalog />);

    fireEvent.click(screen.getByText('Toggle Filters'));

    expect(screen.queryByText('FiltersFallback')).not.toBeInTheDocument();
  });
});
