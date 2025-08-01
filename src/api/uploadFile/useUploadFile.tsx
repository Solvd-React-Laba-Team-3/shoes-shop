import { compressImage, fetchApi } from '@/lib/utils';
import { File as StrapiFile } from '@/types/api/File';
import { useMutation } from '@tanstack/react-query';

const uploadFile = async (files: File | File[]): Promise<StrapiFile[]> => {
  const formData = new FormData();
  const filesToProcess = Array.isArray(files) ? files : [files];

  const compressedFiles = await Promise.all(
    filesToProcess.map(async (file) => {
      try {
        const compressed = await compressImage(file);
        return new File([compressed], file.name, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        });
      } catch (error) {
        console.error(
          `Failed to compress ${file.name}, using original:`,
          error
        );
        return file;
      }
    })
  );

  compressedFiles.forEach((file) => {
    formData.append('files', file);
  });

  return await fetchApi<StrapiFile[]>({
    endpoint: `/upload`,
    method: 'POST',
    body: formData,
  });
};

export const useUploadFile = () => {
  return useMutation<StrapiFile[], Error, File | File[]>({
    mutationFn: uploadFile,
    onError: (error) => {
      console.error('File upload failed:', error.message);
    },
  });
};
