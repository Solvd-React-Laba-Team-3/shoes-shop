import { fetchApi } from '@/lib/utils';
import { File as StrapiFile } from '@/types/api/File';
import { useMutation } from '@tanstack/react-query';

const uploadFile = async (file: File): Promise<StrapiFile[]> => {
  const formData = new FormData();
  formData.append('files', file);

  return await fetchApi<StrapiFile[]>({
    endpoint: `${process.env.NEXT_PUBLIC_API_URL}/upload`,
    method: 'POST',
    body: formData,
  });
};

export const useUploadFile = () => {
  return useMutation<StrapiFile[], Error, File>({
    mutationFn: uploadFile,
    onError: (error) => {
      // Handle error appropriately
      console.error('File upload failed:', error.message);
    },
    onSuccess: (data) => {
      // Handle success appropriately
      console.log('File uploaded successfully:', data);
    },
  });
};
