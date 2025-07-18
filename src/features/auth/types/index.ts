import { z } from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});
export const signUpSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  senha: z.string()
    .min(8, 'A senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
    .regex(/\d/, 'A senha deve conter pelo menos um número'),
  confirmSenha: z.string(),
  documentoFiscal: z.string().min(1, 'Documento fiscal é obrigatório'),
  matricula: z.string().min(1, 'Matrícula é obrigatória'),
  telefone: z.string().min(10, 'Telefone inválido'),
  fotoPerfil: z.string().url('URL inválida').optional().or(z.literal('')),
  cargosNome: z.enum(['ALUNO', 'PROFESSOR', 'FUNCIONARIO']),
})
  .refine(data => data.senha === data.confirmSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmSenha'],
  });
export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type SignInRequest = SignInFormValues;
export type SignUpRequest = Omit<SignUpFormValues, 'confirmSenha' | 'cargosNome'> & {
  matricula: string;
  instituicaoId: string;
  refreshTokenEnabled: boolean;
  cargosNome: string[];
};
export type SignInResponse = {
  data: {
    token: string;
  } | null;
  error: null | errorResponse;
};
export type MeResponse = {
  data: UserProfile | null;
  error: null | errorResponse;
};
export type errorResponse = {
  name: string;
  message: string;
};
export type UserProfile = {
  id: string;
  nome: string;
  email: string;
  documentoFiscal: string;
  fotoPerfil?: string;
  matricula?: number;
  telefone?: string;
  instituicaoId: string;
  instituicaoNome: string;
  refreshTokenEnabled: boolean;
  cargosId: string[];
  cargosNome: string[];
};
