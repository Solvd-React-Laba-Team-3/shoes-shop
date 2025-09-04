import { screen } from '@testing-library/react';
import { ProfileProductsFallback } from './ProfileProductsFallback';
import { render } from '@/testing/utils';

describe('ProfileProductsFallback', () => {
  it('renders styled profile wrapper', () => {
    render(<ProfileProductsFallback />);
    const wrapper = screen.getByTestId('profile-wrapper');
    expect(wrapper).toBeInTheDocument();
  });
});
