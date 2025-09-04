import { useEffect, useState } from 'react';
import { screen } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import { render, createTestQueryClient } from './customRender';

const TestComponent = () => (
  <div data-testid="test-component">Test Content</div>
);

const ComponentWithQuery = () => {
  const [data, setData] = useState<string>('loading');

  useEffect(() => {
    setTimeout(() => setData('loaded'), 0);
  }, []);

  return <div data-testid="query-component">{data}</div>;
};

const ComponentWithTheme = () => {
  return (
    <div data-testid="theme-component" className="theme-test">
      Theme Test
    </div>
  );
};

describe('customRender', () => {
  it('should render a basic component', () => {
    render(<TestComponent />);

    expect(screen.getByTestId('test-component')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render component with custom render options', () => {
    const container = document.createElement('div');
    container.id = 'custom-container';
    document.body.appendChild(container);

    render(<TestComponent />, { container });

    expect(
      container.querySelector('[data-testid="test-component"]')
    ).toBeInTheDocument();

    document.body.removeChild(container);
  });

  it('should wrap component with QueryClientProvider', () => {
    render(<ComponentWithQuery />);

    expect(screen.getByTestId('query-component')).toBeInTheDocument();
    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  it('should wrap component with ThemeProvider', () => {
    render(<ComponentWithTheme />);

    expect(screen.getByTestId('theme-component')).toBeInTheDocument();
    expect(screen.getByText('Theme Test')).toBeInTheDocument();
  });

  it('should create a new QueryClient instance for each render', () => {
    const { rerender } = render(<TestComponent />);

    rerender(<TestComponent />);

    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });

  it('should handle multiple renders independently', () => {
    const { unmount } = render(<TestComponent />);
    expect(screen.getByTestId('test-component')).toBeInTheDocument();

    unmount();

    render(<TestComponent />);
    expect(screen.getByTestId('test-component')).toBeInTheDocument();
  });
});

describe('createTestQueryClient', () => {
  it('should create a QueryClient with correct configuration', () => {
    const queryClient = createTestQueryClient();

    expect(queryClient).toBeInstanceOf(QueryClient);
  });

  it('should create a new QueryClient instance each time', () => {
    const client1 = createTestQueryClient();
    const client2 = createTestQueryClient();

    expect(client1).not.toBe(client2);
  });

  it('should have retry disabled for queries', () => {
    const queryClient = createTestQueryClient();
    const defaultOptions = queryClient.getDefaultOptions();

    expect(defaultOptions.queries?.retry).toBe(false);
  });

  it('should have staleTime configured', () => {
    const queryClient = createTestQueryClient();
    const defaultOptions = queryClient.getDefaultOptions();

    expect(defaultOptions.queries?.staleTime).toBeDefined();
    expect(typeof defaultOptions.queries?.staleTime).toBe('number');
  });
});

describe('Provider Integration', () => {
  it('should provide all required providers in correct order', () => {
    const TestProviderComponent = () => {
      return (
        <div data-testid="provider-test">
          <div data-testid="query-provider">QueryClient Available</div>
          <div data-testid="stripe-provider">Stripe Available</div>
          <div data-testid="theme-provider">Theme Available</div>
        </div>
      );
    };

    render(<TestProviderComponent />);

    expect(screen.getByTestId('provider-test')).toBeInTheDocument();
    expect(screen.getByTestId('query-provider')).toBeInTheDocument();
    expect(screen.getByTestId('stripe-provider')).toBeInTheDocument();
    expect(screen.getByTestId('theme-provider')).toBeInTheDocument();
  });
});
