import { screen, fireEvent } from '@testing-library/react';
import { ConfirmActionModal } from './ConfirmActionModal';
import { render } from '@/testing/utils';

describe('ConfirmActionModal', () => {
  const title = 'Delete Item';
  const description = 'Are you sure you want to delete this item?';
  const onClose = jest.fn();
  const onDelete = jest.fn();

  const renderComponent = (props = {}) =>
    render(
      <ConfirmActionModal
        open={true}
        title={title}
        description={description}
        onClose={onClose}
        onConfirm={onDelete}
        cancelText="Cancel"
        confirmText="Delete"
        {...props}
      />
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal with title and description', () => {
    renderComponent();
    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('renders the cancel and delete buttons with default text', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('renders custom cancel and delete button text', () => {
    renderComponent({ cancelText: 'No', confirmText: 'Yes' });
    expect(screen.getByRole('button', { name: /no/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /yes/i })).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    renderComponent();
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    renderComponent();
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('does not render modal when open is false', () => {
    renderComponent({ open: false });
    expect(screen.queryByText(title)).not.toBeInTheDocument();
    expect(screen.queryByText(description)).not.toBeInTheDocument();
  });
});
