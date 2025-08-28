import { render, screen, fireEvent } from '@testing-library/react';
import { ProductFormDropzone } from './ProductFormDropzone';
import { TempImage } from '@/types/TempImage';

jest.mock('@/components/FileDropZone', () => ({
  FileDropzone: jest.fn(() => <div>Mocked FileDropzone</div>),
}));

jest.mock('../common/DeleteConfirmationModal', () => ({
  DeleteConfirmationModal: jest.fn(
    ({ open, onClose, onDelete, title, description }) =>
      open ? (
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
          <button onClick={onClose}>Cancel</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      ) : null
  ),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

jest.mock('@mui/icons-material/Delete', () => {
  const MockDeleteIcon = () => <span>DeleteIcon</span>;
  MockDeleteIcon.displayName = 'DeleteIcon';
  return MockDeleteIcon;
});

describe('ProductFormDropzone', () => {
  const images: TempImage[] = [
    { id: 1, url: 'image1.jpg' },
    { id: 2, url: 'image2.jpg' },
  ];

  const handleFilesDropped = jest.fn();
  const onRemoveImage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders FileDropzone', () => {
    render(
      <ProductFormDropzone
        images={images}
        onRemoveImage={onRemoveImage}
        handleFilesDropped={handleFilesDropped}
      />
    );

    expect(screen.getByText('Mocked FileDropzone')).toBeInTheDocument();
  });

  it('opens DeleteConfirmationModal when delete button is clicked', () => {
    render(
      <ProductFormDropzone
        images={images}
        onRemoveImage={onRemoveImage}
        handleFilesDropped={handleFilesDropped}
      />
    );

    fireEvent.click(screen.getAllByLabelText('Delete image')[0]);

    expect(
      screen.getByText('Are you sure to delete product image?')
    ).toBeInTheDocument();
    expect(screen.getByText(/Lorem ipsum/)).toBeInTheDocument();
  });

  it('closes modal when cancel is clicked', () => {
    render(
      <ProductFormDropzone
        images={images}
        onRemoveImage={onRemoveImage}
        handleFilesDropped={handleFilesDropped}
      />
    );

    fireEvent.click(screen.getAllByLabelText('Delete image')[0]);
    fireEvent.click(screen.getByText('Cancel'));

    expect(
      screen.queryByText('Are you sure to delete product image?')
    ).not.toBeInTheDocument();
  });

  it('calls onRemoveImage and closes modal when delete is confirmed', () => {
    render(
      <ProductFormDropzone
        images={images}
        onRemoveImage={onRemoveImage}
        handleFilesDropped={handleFilesDropped}
      />
    );

    fireEvent.click(screen.getAllByLabelText('Delete image')[1]);
    fireEvent.click(screen.getByText('Delete'));

    expect(onRemoveImage).toHaveBeenCalledWith(images[1].id, 1);
    expect(
      screen.queryByText('Are you sure to delete product image?')
    ).not.toBeInTheDocument();
  });
});
