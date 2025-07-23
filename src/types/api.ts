export type PaginatedResponse<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
};

export type ApiSelectOption = {
  id: string;
  nome: string;
};
