import { Button, IconButton } from '@/components/ui';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { FC } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

interface DeleteConfirmationModalProps {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  onDelete: () => void;
  cancelText?: string;
  deleteText?: string;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    position: 'relative',
    flexDirection: 'column',
    gap: '36px',
    width: '650px',
    padding: '32px',
    [theme.breakpoints.down('md')]: {
      gap: '0',
      width: 'unset',
      padding: '12px 24px',
    },
    [theme.breakpoints.down('sm')]: {
      padding: '12px',
    },
  },
}));

export const DeleteConfirmationModal: FC<DeleteConfirmationModalProps> = ({
  open,
  title,
  description,
  onClose,
  onDelete,
  cancelText = 'Cancel',
  deleteText = 'Delete',
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
      <Box sx={{ maxWidth: 'calc(100% - 26px)' }}>
        <DialogTitle variant="h2">{title}</DialogTitle>
      </Box>
      <DialogContent>
        <Typography variant="caption">{description}</Typography>
      </DialogContent>
      <DialogActions sx={{ gap: '16px', justifyContent: 'center' }}>
        <Button variant="outlined" onClick={onClose}>
          {cancelText}
        </Button>
        <Button variant="contained" onClick={onDelete}>
          {deleteText}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
};
