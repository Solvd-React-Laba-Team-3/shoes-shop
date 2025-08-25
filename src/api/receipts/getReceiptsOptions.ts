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
  const proxyUrl = `/api/download-receipt?chargeId=${chargeId}&filename=${encodedFilename}`;

  const response = await fetch(proxyUrl);

  if (!response.ok) {
    throw new Error('Failed to download receipt');
  }

  const blob = await response.blob();
  return { blob, filename };
};

export const useDownloadReceipt = () => {
  return useMutation({
    mutationFn: downloadReceipt,
    onSuccess: ({ blob, filename }) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Error downloading receipt:', error.message);
      } else {
        console.error('Error downloading receipt:', error);
      }
    },
  });
};
