export type StrapiError<Field extends string = string> = {
  error: {
    status: number;
    name: string;
    message: string;
    details?: {
      errors?: Array<{
        path: Field[];
        message: string;
        name: string;
      }>;
    };
  };
};
