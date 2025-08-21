import { Box, styled, Typography } from '@mui/material';
import InsertPhotoOutlined from '@mui/icons-material/InsertPhotoOutlined';
import { DragEvent, FC, useCallback, useRef } from 'react';

interface FileDropzoneProps {
  onFilesDropped: (files: File[]) => void;
}

const StyledDropzone = styled(Box)(({ theme }) => ({
  border: `1px dashed ${theme.palette.text.secondary}`,
  borderRadius: `${theme.shape.borderRadius}`,
  display: 'flex',
  alignItems: 'center',
  width: '320px',
  height: '380px',
  justifyContent: 'center',
  cursor: 'pointer',
  padding: '20px',
  [theme.breakpoints.down('md')]: {
    width: 'min(100%, 320px)',
  },
}));

export const FileDropzone: FC<FileDropzoneProps> = ({ onFilesDropped }) => {
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
      <StyledDropzone
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
      </StyledDropzone>
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        name="file"
        accept="image/*"
        multiple
        onChange={(e) => {
          const { files } = e.target;
          if (files) {
            onFilesDropped(Array.from(files));
          }
        }}
      />
    </>
  );
};
