import { compressImage, type CompressionOptions } from './compressImage';

describe('compressImage', () => {
  let file: File;
  let mockImage: ReturnType<typeof createMockImage>;

  const createMockImage = (width: number, height: number) => ({
    width,
    height,
    onload: null as (() => void) | null,
    onerror: null as (() => void) | null,
  });

  const createMockCanvas = (mockBlob?: Blob) => ({
    width: 0,
    height: 0,
    getContext: jest.fn().mockReturnValue({
      drawImage: jest.fn(),
    }),
    toBlob: jest.fn().mockImplementation((callback) => {
      callback(mockBlob || new Blob(['test'], { type: 'image/jpeg' }));
    }),
  });

  const setupImageMock = (width: number, height: number) => {
    mockImage = createMockImage(width, height);
    global.Image = jest.fn().mockImplementation(() => {
      Promise.resolve().then(() => {
        if (mockImage.onload) {
          mockImage.onload();
        }
      });
      return mockImage;
    });
  };

  beforeEach(() => {
    file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    global.URL.createObjectURL = jest.fn().mockReturnValue('mock-url');
    global.URL.revokeObjectURL = jest.fn();

    setupImageMock(2000, 1500);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should compress an image with default options', async () => {
    const mockCanvas = createMockCanvas();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

    const result = await compressImage(file);

    expect(URL.createObjectURL).toHaveBeenCalledWith(file);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');

    expect(document.createElement).toHaveBeenCalledWith('canvas');
    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');

    expect(mockCanvas.width).toBe(1920);
    expect(mockCanvas.height).toBe(1440);

    expect(mockCanvas.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      'image/jpeg',
      0.8
    );

    expect(result).toBeInstanceOf(Blob);
  });

  it('should handle custom compression options', async () => {
    const options: CompressionOptions = {
      maxDimension: 1000,
      quality: 0.5,
      outputFormat: 'image/webp',
    };

    const mockCanvas = createMockCanvas();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

    await compressImage(file, options);

    expect(mockCanvas.width).toBe(1000);
    expect(mockCanvas.height).toBe(750);
    expect(mockCanvas.toBlob).toHaveBeenCalledWith(
      expect.any(Function),
      'image/webp',
      0.5
    );
  });

  it('should maintain aspect ratio when resizing', async () => {
    setupImageMock(1500, 2000);

    const mockCanvas = createMockCanvas();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

    await compressImage(file);

    expect(mockCanvas.width).toBe(1440);
    expect(mockCanvas.height).toBe(1920);
  });

  it('should not resize if dimensions are within limits', async () => {
    setupImageMock(800, 600);

    const mockCanvas = createMockCanvas();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

    await compressImage(file);

    expect(mockCanvas.width).toBe(800);
    expect(mockCanvas.height).toBe(600);
  });

  it('should handle canvas context failure', async () => {
    const mockCanvas = {
      getContext: jest.fn().mockReturnValue(null),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jest.spyOn(document, 'createElement').mockReturnValue(mockCanvas as any);

    await expect(compressImage(file)).rejects.toThrow(
      'Failed to get canvas context'
    );
  });

  it('should handle image load failure', async () => {
    mockImage = createMockImage(2000, 1500);
    global.Image = jest.fn().mockImplementation(() => {
      Promise.resolve().then(() => {
        if (mockImage.onerror) {
          mockImage.onerror();
        }
      });
      return mockImage;
    });

    await expect(compressImage(file)).rejects.toThrow('Failed to load image');
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');
  });
});
