import { Box, styled, Typography } from '@mui/material';
import InsertPhotoOutlined from '@mui/icons-material/InsertPhotoOutlined';
import { DragEvent, FC, useCallback, useRef } from 'react';

interface FileDropZoneProps {
  onFilesDropped: (files: File[]) => void;
}

const StyledDropZone = styled(Box)(({ theme }) => ({
  border: `1px dashed ${theme.palette.text.secondary}`,
  borderRadius: `${theme.shape.borderRadius}`,
  display: 'flex',
  alignItems: 'center',
  width: '320px',
  height: '305px',
  justifyContent: 'center',
  cursor: 'pointer',
  padding: '20px',
}));

export const FileDropZone: FC<FileDropZoneProps> = ({ onFilesDropped }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const droppedFiles = Array.from(event.dataTransfer.files);
      onFilesDropped(droppedFiles);
    },
    [onFilesDropped]
  );

  return (
    <>
      <StyledDropZone
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            width: '172px',
          }}
        >
          <InsertPhotoOutlined fontSize="large" color="inherit" />
          <Typography
            sx={{ lineHeight: '100%' }}
            variant="caption"
            color="text.secondary"
            textAlign="center"
          >
            Drop your image here, or click to select a file
          </Typography>
        </Box>
      </StyledDropZone>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        name="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          const files = e.target.files;
          if (files) {
            onFilesDropped(Array.from(files));
          }
        }}
      />
    </>
  );
};
