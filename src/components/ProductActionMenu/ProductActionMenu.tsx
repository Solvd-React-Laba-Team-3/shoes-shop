'use client';

import { useState, MouseEvent, FC } from 'react';
import { Menu, MenuItem, ListItemText } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Link from 'next/link';
import { IconButton } from '@/components/ui';
import { EditProductModal } from '../common/EditProductModal';
import { Product } from '@/types/Product';
import { useDeleteProduct } from '@/api/products/useDeleteProduct';
import { useSession } from 'next-auth/react';
import { useCreateProduct } from '@/api/products/useCreateProduct';
import LinearProgress from '@mui/material/LinearProgress';

interface ProductActionMenuProps {
  product: Product;
}

export const ProductActionMenu: FC<ProductActionMenuProps> = ({ product }) => {
  const { data: session } = useSession();
  const { mutate: deleteProduct, isPending: isDeletePending } =
    useDeleteProduct();
  const { mutate: createProduct, isPending: isCreatePending } =
    useCreateProduct();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDuplicateProduct = () => {
    if (!session) return;

    createProduct({
      body: {
        data: {
          userID: session.user.id,
          images: product.images?.map((image) => image.id) || null,
          categories:
            product.categories?.map((category) => category.id) || null,
          brand: product.brand.id,
          color: product.color.id,
          gender: product.gender.id,
          sizes: product.sizes.map((size) => size.id),
          price: product.price,
          name: product.name,
          description: product.description,
        },
      },
      token: session.user.accessToken,
    });
    setAnchorEl(null);
  };

  const handleEditProduct = () => {
    setIsEditModalOpen(true);
    setAnchorEl(null);
  };

  const handleDeleteProduct = () => {
    if (!session) return;

    deleteProduct({
      id: product.id,
      token: session.user.accessToken,
    });
    setAnchorEl(null);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        open={open}
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
        }}
      >
        <MenuItem
          onClick={handleClose}
          component={Link}
          href={`/products/${product.id}`}
        >
          <ListItemText primary="View" />
        </MenuItem>

        <MenuItem onClick={handleEditProduct}>
          <ListItemText primary="Edit" />
        </MenuItem>

        <MenuItem onClick={handleDuplicateProduct}>
          <ListItemText primary="Duplicate" />
        </MenuItem>

        <MenuItem onClick={handleDeleteProduct} sx={{ color: 'error.main' }}>
          <ListItemText primary="Delete" />
        </MenuItem>
      </Menu>
      <EditProductModal
        open={isEditModalOpen}
        onClose={handleEditModalClose}
        editingProduct={product}
      />
    </>
  );
};
