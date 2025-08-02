import { FC, useState } from 'react';
import { FileDropZone } from '@/components/FileDropZone';
import Image from 'next/image';
import { DeleteImageModal } from '../common/DeleteImageModal';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import { ImageType } from '../ProductForm';

interface ProductFormDropzoneProps {
  images: ImageType[];
  onRemoveImage: (index: number) => void;
  handleFilesDropped: (files: File[]) => void;
}

export const ProductFormDropzone: FC<ProductFormDropzoneProps> = ({
  images,
  onRemoveImage,
  handleFilesDropped,
}) => {
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '52px',
        }}
      >
        <FileDropZone onFilesDropped={handleFilesDropped} />

        {images.map((image, index) => (
          <Box key={index} sx={{ position: 'relative' }}>
            <Image src={image.url} alt="Product" width={320} height={380} />
            <Fab
              size="small"
              color="error"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
              }}
              onClick={() => setDeletingImageId(image.id)}
            >
              <DeleteIcon />
            </Fab>
          </Box>
        ))}
      </Box>
      {deletingImageId !== null && (
        <DeleteImageModal
          open={deletingImageId !== null}
          onClose={() => setDeletingImageId(null)}
          onDelete={() => {
            onRemoveImage(deletingImageId);
            setDeletingImageId(null);
          }}
        />
      )}
    </>
  );
};
