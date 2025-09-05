import { render, screen, fireEvent, createEvent } from '@testing-library/react';
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

  it('does not call onFilesDropped if no files are selected', () => {
    const handleDrop = jest.fn();
    render(<FileDropzone onFilesDropped={handleDrop} />);

    const inputElement = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    fireEvent.change(inputElement, { target: { files: null } });

    expect(handleDrop).not.toHaveBeenCalled();
  });

  it('prevents default behavior on drag over', () => {
    render(<FileDropzone onFilesDropped={() => {}} />);

    const dropzone = screen
      .getByText(/Drop your image here, or click to select a file/i)
      .closest('div')!;

    const dragOverEvent = createEvent.dragOver(dropzone);
    dragOverEvent.preventDefault = jest.fn();

    fireEvent(dropzone, dragOverEvent);

    expect(dragOverEvent.preventDefault).toHaveBeenCalled();
  });
});
