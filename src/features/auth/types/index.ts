import { z } from 'zod';

export const ROLES = [
  'ADMIN',
  'USUARIO_INTERNO',
  'USUARIO_EXTERNO',
] as const;

export type UserRole = (typeof ROLES)[number];

export const signInSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

export const signUpSchema = z
  .object({
    nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    senha: z
      .string()
      .min(8, 'A senha deve ter no mínimo 8 caracteres')
      .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
      .regex(/\d/, 'A senha deve conter pelo menos um número'),
    confirmSenha: z.string(),
    documentoFiscal: z.string().min(1, 'Documento fiscal é obrigatório'),
    matricula: z.string().min(1, 'Matrícula é obrigatória'),
    telefone: z.string().min(10, 'Telefone inválido'),
    fotoPerfil: z.string().url('URL inválida').optional().or(z.literal('')),
    cargosNome: z.enum(ROLES),
    instituicaoId: z.string({ required_error: 'Por favor, selecione uma instituição.' }),
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

export type AuthState = {
  user: UserProfile | null;
  accessToken: string | null;
  refreshTimerId: NodeJS.Timeout | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  setAuth: (user: UserProfile, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
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

export type cargo = {
  descricao: string;
  id: string;
  nome: UserRole;
};

export type instituicao = {
  descricao: string;
  id: string;
  nome: string;
};

export type UserProfile = {
  cargos: cargo[];
  documentoFiscal: string;
  fotoPerfil?: string;
  id: string;
  instituicao: instituicao;
  matricula?: number;
  nome: string;
  refreshTokenEnabled: boolean;
  telefone?: string;
};
