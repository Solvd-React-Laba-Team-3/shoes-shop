import { fetchApi } from '@/lib/utils';
import { useMutation } from '@tanstack/react-query';

interface DownloadReceiptArgs {
  chargeId: string;
  orderNumber: string;
}

export const downloadReceipt = async ({
  chargeId,
  orderNumber,
}: DownloadReceiptArgs) => {
  const filename = `order-${orderNumber}.pdf`;
  const encodedFilename = encodeURIComponent(filename);

  return await fetchApi<Blob>({
    endpoint: '/orders/download-receipt',
    method: 'GET',
    queryParams: {
      chargeId,
      filename: encodedFilename,
    },
    apiRoute: true,
    responseType: 'blob',
  });
};

const handleDownloadReceipt = async (
  data: Blob,
  variables: DownloadReceiptArgs
) => {
  const url = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = url;
  link.download = `order-${variables.orderNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const useDownloadReceipt = () => {
  return useMutation<Blob, Error, DownloadReceiptArgs>({
    mutationFn: downloadReceipt,
    onSuccess: handleDownloadReceipt,
    onError: (error) => {
      console.error('Error downloading receipt:', error);
    },
  });
};
