import { fetchApi } from '@/lib/utils';
import { File as StrapiFile } from '@/types/api/File';
import { useMutation } from '@tanstack/react-query';

const uploadFile = async (files: File | File[]): Promise<StrapiFile[]> => {
  const formData = new FormData();
  const filesToUpload = Array.isArray(files) ? files : [files];

  if (filesToUpload.length > 5) {
    const uploadPromises = [];
    for (let i = 0; i < filesToUpload.length; i += 5) {
      const chunk = filesToUpload.slice(i, i + 5);
      const chunkFormData = new FormData();
      chunk.forEach((file) => {
        chunkFormData.append('files', file);
      });
      uploadPromises.push(
        fetchApi<StrapiFile[]>({
          endpoint: `/upload`,
          method: 'POST',
          body: chunkFormData,
        })
      );
    }
    const responses = await Promise.all(uploadPromises);
    return responses.flat();
  }

  filesToUpload.forEach((file) => {
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
