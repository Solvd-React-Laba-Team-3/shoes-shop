import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LabeledTextfield } from './LabeledTextField';

describe('LabeledTextfield', () => {
  it('renders input and label correctly', () => {
    render(
      <LabeledTextfield
        id="username"
        label="Username"
        value="Olha"
        onChange={() => {}}
      />
    );

    const input = screen.getByDisplayValue('Olha');
    const label = screen.getByText('Username');

    expect(input).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  it('input shows a value prop correctly', () => {
    const testValue = 'Jane';

    render(<LabeledTextfield id="test-input" label="Jack" value={testValue} />);

    const input = screen.getByRole('textbox');

    expect(input).toHaveValue(testValue);
  });

  it('label has the required attribute rendered', () => {
    render(
      <LabeledTextfield id="test-input" label="test label" value="" required />
    );

    const label = screen.getByText(/test label/i);
    const asterisk = label.querySelector('.MuiInputLabel-asterisk');

    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveTextContent('*');
  });
});
