import { FC, useState } from 'react';
import { FileDropzone } from '@/components/FileDropZone';
import Image from 'next/image';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal';
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
          gridTemplateColumns: '1fr 1fr',
          gap: '52px',
          flex: 1,
        }}
      >
        <FileDropzone onFilesDropped={handleFilesDropped} />

        {images.map((image, index) => (
          <Box key={index} sx={{ position: 'relative' }}>
            <Image src={image.url} alt="Product" width={320} height={380} />
            <Fab
              aria-label="Delete image"
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
        <DeleteConfirmationModal
          open={deletingImage !== null}
          title="Are you sure to delete product image?"
          description="Lorem ipsum dolor sit amet consectetur. Sed imperdiet tempor facilisi
          massa aliquet sit habitant. Lorem ipsum dolor sit amet consectetur."
          onClose={() => setDeletingImage(null)}
          onDelete={() => {
            onRemoveImage(deletingImage.id, deletingImage.index);
            setDeletingImage(null);
          }}
        />
      )}
    </>
  );
};
