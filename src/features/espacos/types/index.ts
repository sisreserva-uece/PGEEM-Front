export type ApiSelectOption = {
  id: string;
  nome: string;
};

export type Espaco = {
  id: string;
  nome: string;
  urlCnpq: string | null;
  observacao: string | null;
  precisaProjeto: boolean;
  departamento: ApiSelectOption;
  localizacao: ApiSelectOption;
  tipoEspaco: ApiSelectOption;
  tipoAtividade: ApiSelectOption;
};

export type PaginatedResponse<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
};
