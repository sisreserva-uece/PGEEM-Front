export interface PerfilFormValues {
    nome: string;
    email: string;
    matricula?: string;
    telefone?: string;
    senha?: string;
    confirmarSenha?: string;
    instituicaoId?: string;
    cargosId?: string[];
    fotoPerfil?: string;
}

export type ProfileUpdatePayload = Omit<PerfilFormValues, 'confirmarSenha'>;
  
export interface UpdatePerfilResponse {
    data: any; 
    message?: string;
}