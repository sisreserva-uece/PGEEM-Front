import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});
export const signUpSchema = z
  .object({
    nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    senha: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
    confirmSenha: z.string(),
    matricula: z.string().min(1, 'Matrícula é obrigatória'),
    telefone: z.string().min(10, 'Telefone inválido'),
    fotoPerfil: z.string().url('URL inválida').optional().or(z.literal('')),
    cargosNome: z.enum(['ALUNO', 'PROFESSOR', 'FUNCIONARIO']),
  })
  .refine(data => data.senha === data.confirmSenha, {
    message: 'Senhas não coincidem',
    path: ['confirmSenha'],
  });
export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type SignInRequest = SignInFormValues;
export type SignUpRequest = Omit<SignUpFormValues, 'confirmSenha'> & {
  matricula: string;
  instituicaoId: string;
  refreshTokenEnabled: boolean;
  cargosNome: string[];
};
export type SignInResponse = {
  token: string;
};
export type UserProfile = {
  id: string;
  email: string;
  nome: string;
  role: string;
  matricula?: number;
  telefone?: string;
  fotoPerfil?: string;
};
