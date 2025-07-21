import { QueryParam } from './QueryParam';

export type SortOption<Fields extends string> =
  | `${Fields}:${'asc' | 'desc'}`
  | Array<`${Fields}:${'asc' | 'desc'}`>;

type FilterValue =
  | string
  | number
  | boolean
  | string[]
  | { [operator: string]: FilterValue };

type Filters<Fields extends string> = {
  [K in Fields]?: FilterValue | Filters<Fields>;
};

type Populate<Fields extends string> =
  | '*'
  | Fields
  | Fields[]
  | { [K in Fields]?: true | Populate<Fields> };

export type StrapiQueryParams<Fields extends string> = QueryParam & {
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  sort?: SortOption<Fields>;
  populate?: Populate<Fields>;
  filters?: Filters<Fields>;
};
