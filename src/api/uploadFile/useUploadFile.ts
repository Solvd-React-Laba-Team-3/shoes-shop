import { fetchApi } from '@/lib/utils';
import { File as StrapiFile } from '@/types/api/File';
import { useMutation } from '@tanstack/react-query';

const uploadFile = async (file: File): Promise<StrapiFile[]> => {
  const formData = new FormData();
  formData.append('files', file);

  return await fetchApi<StrapiFile[]>({
    endpoint: `/upload`,
    method: 'POST',
    body: formData,
  });
};

export const useUploadFile = () => {
  return useMutation<StrapiFile[], Error, File>({
    mutationFn: uploadFile,
    onError: (error) => {
      console.error('File upload failed:', error.message);
    },
    onSuccess: (data) => {
      console.log('File uploaded successfully:', data);
    },
  });
};
