'use client';

import { useState, MouseEvent, FC } from 'react';
import { Menu, MenuItem, ListItemText } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { IconButton } from '@/components/ui';
import { EditProductModal } from '../common/EditProductModal';
import { Product } from '@/types/Product';
import { useDeleteProduct } from '@/api/products/useDeleteProduct';
import { useCreateProduct } from '@/api/products/useCreateProduct';
import LinearProgress from '@mui/material/LinearProgress';
import { useRouter } from 'next/navigation';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal';

interface ProductActionMenuProps {
  product: Product;
}

export const ProductActionMenu: FC<ProductActionMenuProps> = ({ product }) => {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { mutate: deleteProduct, isPending: isDeletePending } =
    useDeleteProduct();
  const { mutate: createProduct, isPending: isCreatePending } =
    useCreateProduct();

  const isOpen = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDuplicateProduct = () => {
    createProduct({
      body: {
        data: {
          images: product.images?.map((image) => image.id),
          brand: product.brand.id,
          color: product.color.id,
          gender: product.gender.id,
          sizes: product.sizes.map((size) => size.id),
          price: product.price,
          name: product.name,
          description: product.description,
        },
      },
    });
    setAnchorEl(null);
  };

  const handleViewProduct = () => {
    setAnchorEl(null);
    router.push(`/products/${product.id}`);
  };

  const handleEditProduct = () => {
    setIsEditModalOpen(true);
    setAnchorEl(null);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setAnchorEl(null);
  };

  const handleDeleteProduct = () => {
    deleteProduct({ id: product.id });
    setIsDeleteModalOpen(false);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    {
      label: 'View',
      action: handleViewProduct,
    },
    {
      label: 'Edit',
      action: handleEditProduct,
    },
    {
      label: 'Duplicate',
      action: handleDuplicateProduct,
    },
    {
      label: 'Delete',
      action: handleOpenDeleteModal,
    },
  ];

  return (
    <>
      {(isDeletePending || isCreatePending) && (
        <LinearProgress
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '5px',
          }}
        />
      )}

      <IconButton color="secondary" onClick={handleClick}>
        <MoreHorizIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiListItemText-primary': {
            fontSize: '13px',
            fontWeight: 300,
          },
          '& .MuiPaper-root': {
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
          },
          '& .MuiMenuItem-root:last-child': {
            color: 'error.main',
          },
        }}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.label}
            onClick={item.action}
            sx={{
              minHeight: '32px',
            }}
          >
            <ListItemText primary={item.label} />
          </MenuItem>
        ))}
      </Menu>
      {isEditModalOpen && (
        <EditProductModal
          open={isEditModalOpen}
          onClose={handleEditModalClose}
          editingProduct={product}
        />
      )}
      <DeleteConfirmationModal
        open={isDeleteModalOpen}
        title="Are you sure to delete this product?"
        description="Lorem ipsum dolor sit amet consectetur. Sed imperdiet tempor facilisi
          massa aliquet sit habitant. Lorem ipsum dolor sit amet consectetur."
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteProduct}
      />
    </>
  );
};
