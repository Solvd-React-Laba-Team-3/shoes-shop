export type SortOption<Fields extends string> =
  | `${Fields}:${'asc' | 'desc'}`
  | Array<`${Fields}:${'asc' | 'desc'}`>;

type FieldValue = string | number | boolean | string[];

type Populate<Fields extends string> =
  | '*'
  | Fields
  | Fields[]
  | { [K in Fields]?: true | Populate<Fields> };

export type StrapiQueryParams<Fields extends string> = {
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  sort?: SortOption<Fields>;
  populate?:
    | '*'
    | Fields
    | Fields[]
    | { [K in Fields]?: true | Populate<Fields> };
  filters?: Partial<
    Record<
      Fields,
      | FieldValue
      | FieldValue[]
      | Record<string, FieldValue | FieldValue[] | undefined>
    >
  >;
};
