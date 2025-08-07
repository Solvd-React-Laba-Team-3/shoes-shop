'use client';

import { CartItem } from '@/components/CartItem';
import { CartSummary } from '@/components/CartSummary';
import { DeleteConfirmationModal } from '@/components/common/DeleteConfirmationModal';
import { Header } from '@/components/common/Header';
import { useCart } from '@/lib/hooks/useCart/useCart';
import { Box, Stack, Typography } from '@mui/material';

export default function Cart() {
  const {
    items,
    // handleIncrease,
    // handleDecrease,
    onCancelDelete,
    onConfirmDelete,
    // onRequestDelete,
    deleteModalOpen,
  } = useCart();

  return (
    <>
      <Header />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          padding: '80px 196px',
        }}
      >
        <Stack>
          <Typography variant="h2" sx={{ marginBottom: '32px' }}>
            Cart
          </Typography>
          <Box>
            <Stack direction="column" spacing={4} alignItems="stretch">
              {items && items.length > 0 ? (
                items
                  .filter((item) => item.quantity > 0)
                  .map((item) => (
                    <CartItem
                      key={item.id}
                      {...item}
                      gender={item.gender}
                      images={item.images || []}
                      // onIncrease={() => handleIncrease(item.id, item.quantity)}
                      // onDecrease={() => handleDecrease(item.id, item.quantity)}
                      // onDelete={() => onRequestDelete(item.id)}
                    />
                  ))
              ) : (
                <Typography variant="h6" color="text.secondary">
                  Your cart is empty.
                </Typography>
              )}
            </Stack>
          </Box>
        </Stack>

        <DeleteConfirmationModal
          title="Are you sure you want to remove this product from the cart?"
          description="Confirm to continue or cancel."
          open={deleteModalOpen}
          onClose={onCancelDelete}
          onDelete={onConfirmDelete}
        />

        <Stack>
          <Typography variant="h2" sx={{ marginBottom: '32px' }}>
            Summary
          </Typography>

          <Box>
            <Stack direction="column">
              <CartSummary />
            </Stack>
          </Box>
        </Stack>
      </Box>
    </>
  );
}
