import { render, screen, fireEvent } from '@testing-library/react';
import { FileDropzone } from './FileDropzone';

describe('FileDropzone', () => {
  it('calls onFilesDropped when a file is dropped', () => {
    const handleDrop = jest.fn();
    render(<FileDropzone onFilesDropped={handleDrop} />);

    const file = new File(['dummy content'], 'image.png', {
      type: 'image/png',
    });
    const dataTransfer = {
      files: [file],
      types: ['Files'],
    };

    fireEvent.drop(screen.getByText(/drop your image/i), {
      dataTransfer,
    });

    expect(handleDrop).toHaveBeenCalledWith([file]);
  });

  it('opens file input when clicked', async () => {
    render(<FileDropzone onFilesDropped={() => {}} />);

    const file = new File(['dummy'], 'photo.jpg', { type: 'image/jpeg' });

    const inputElement = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    await fireEvent.click(screen.getByText(/drop your image/i));

    fireEvent.change(inputElement, { target: { files: [file] } });

    expect(inputElement.files?.[0]).toEqual(file);
  });
});
