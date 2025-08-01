import { Button, IconButton } from '@/components/ui';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

interface DeleteImageModalProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    position: 'relative',
    flexDirection: 'column',
    gap: '36px',
    minWidth: '650px',
    padding: '32px',
  },
});

export const DeleteImageModal: FC<DeleteImageModalProps> = ({
  open,
  onClose,
  onDelete,
}) => {
  return (
    <StyledDialog open={open} onClose={onClose}>
      <IconButton
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
        }}
        color="secondary"
        onClick={onClose}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle variant="h2">
        Are you sure to delete product image?
      </DialogTitle>
      <DialogContent>
        <Typography variant="caption">
          Lorem ipsum dolor sit amet consectetur. Sed imperdiet tempor facilisi
          massa aliquet sit habitant. Lorem ipsum dolor sit amet consectetur.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ gap: '16px', justifyContent: 'center' }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onDelete}>
          Delete
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};
