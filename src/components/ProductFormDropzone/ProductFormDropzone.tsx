import { FC, useState } from 'react';
import { FileDropzone } from '@/components/FileDropZone';
import Image from 'next/image';
import { ConfirmActionModal } from '../common/ConfirmActionModal';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import { TempImage } from '@/types/TempImage';

interface ProductFormDropzoneProps {
  images: TempImage[];
  onRemoveImage: (id: number, index: number) => void;
  handleFilesDropped: (files: File[]) => void;
}

export const ProductFormDropzone: FC<ProductFormDropzoneProps> = ({
  images,
  onRemoveImage,
  handleFilesDropped,
}) => {
  const [deletingImage, setDeletingImage] = useState<{
    id: number;
    index: number;
  } | null>(null);

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            sm: 'min-content',
            lg: '1fr 1fr ',
            xl: '1fr 1fr',
          },
          gap: { xs: '20px', md: '52px' },
          flex: 1,
        }}
      >
        <FileDropzone onFilesDropped={handleFilesDropped} />

        {images.map((image, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',
              width: { xs: '100%', md: 'unset' },
              zIndex: 1,
            }}
          >
            <Image src={image.url} alt="Product" width={300} height={380} />
            <Fab
              size="small"
              color="error"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
              }}
              onClick={() => setDeletingImage({ id: image.id, index })}
            >
              <DeleteIcon />
            </Fab>
          </Box>
        ))}
      </Box>
      {deletingImage !== null && (
        <ConfirmActionModal
          open={deletingImage !== null}
          title="Are you sure to delete product image?"
          description="This will remove this image from this product."
          onClose={() => setDeletingImage(null)}
          onConfirm={() => {
            onRemoveImage(deletingImage.id, deletingImage.index);
            setDeletingImage(null);
          }}
        />
      )}
    </>
  );
};
