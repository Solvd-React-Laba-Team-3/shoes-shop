export type ProductBody = {
  data: {
    name: string;
    images: (string | number)[];
    description: string;
    brand: string | number;
    categories: (string | number)[];
    color: string | number;
    gender: string | number;
    sizes: (string | number)[];
    price: number;
    userID?: string | number;
    teamName?: string;
  };
};
