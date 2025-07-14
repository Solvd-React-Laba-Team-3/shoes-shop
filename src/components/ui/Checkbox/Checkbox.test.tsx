// import { render, screen } from '@testing-library/react';
// import { Checkbox } from './Checkbox';

// describe('Checkbox', () => {
//   it('rendered on mount', () => {
//     render(<Checkbox checked={false} onChange={() => {}} />);
//   });

//   it('rendered with label', () => {
//     render(<Checkbox label="Accept terms" checked={false} onChange={() => {}} />);
//     expect(screen.getByText('Accept terms')).toBeInTheDocument();
//   });

//   it('rendered without label when not provided', () => {
//     const { container } = render(<Checkbox checked={false} onChange={() => {}} />);
//     const label = container.querySelector('.MuiFormControlLabel-label');
//     expect(label).toBeNull();
//   });
// });
