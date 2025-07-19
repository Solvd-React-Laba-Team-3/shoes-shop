export interface FileFormatProviderMetadata {
  public_id: string;
  resource_type: string;
}

export interface FileFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  provider_metadata: FileFormatProviderMetadata;
}

export interface File {
  id: number;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    [key: string]: FileFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: FileFormatProviderMetadata;
  createdAt: string;
  updatedAt: string;
}
