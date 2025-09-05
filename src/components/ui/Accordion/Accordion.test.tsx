import { render, screen, fireEvent } from '@testing-library/react';
import { Accordion } from './Accordion';

describe('Accordion', () => {
  it('renders with label', () => {
    render(
      <Accordion label="Test Label">
        <></>
      </Accordion>
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders children when expanded', () => {
    render(
      <Accordion label="Open me" defaultExpanded>
        <div>Child Content</div>
      </Accordion>
    );

    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('toggles children visibility on click', () => {
    render(
      <Accordion label="Toggle me">
        <div>Hidden Content</div>
      </Accordion>
    );

    const summary = screen.getByText('Toggle me');

    expect(screen.queryByText('Hidden Content')).toBeInTheDocument();

    expect(summary.closest('.MuiAccordionSummary-root')).toHaveAttribute(
      'aria-expanded',
      'false'
    );

    fireEvent.click(summary);
    expect(summary.closest('.MuiAccordionSummary-root')).toHaveAttribute(
      'aria-expanded',
      'true'
    );

    fireEvent.click(summary);
    expect(summary.closest('.MuiAccordionSummary-root')).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });
});
