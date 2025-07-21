import { fireEvent, render, screen } from '@testing-library/react';
import { ReviewPanel } from './ReviewPanel';

describe('ReviewPanel', () => {
  it('renders quote, name, location and rating correctly', () => {
    const { container } = render(
      <ReviewPanel
        quote="Pain changes shape, but it never disappears."
        name="Keanu Reeves"
        location="Hollywood, Los Angeles"
        rating={4}
      />
    );

    expect(
      screen.getByText(/Pain changes shape, but it never disappears./i)
    ).toBeInTheDocument();
    expect(screen.getByText('Keanu Reeves')).toBeInTheDocument();
    expect(screen.getByText('Hollywood, Los Angeles')).toBeInTheDocument();

    const filledStars = container.querySelectorAll('.MuiRating-iconFilled');
    expect(filledStars.length).toBe(4);
  });

  it('calls onPrev and onNext when navigation buttons are clicked', () => {
    const onPrev = jest.fn();
    const onNext = jest.fn();

    render(
      <ReviewPanel
        quote="Pain changes shape, but it never disappears."
        name="Keanu Reeves"
        location="Hollywood, Los Angeles"
        rating={4}
        onPrev={onPrev}
        onNext={onNext}
      />
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);

    expect(onPrev).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
