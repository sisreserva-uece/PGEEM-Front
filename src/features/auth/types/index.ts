import { cpf } from 'cpf-cnpj-validator';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { z } from 'zod';

export const ROLES = [
  'ADMIN',
  'USUARIO_INTERNO',
  'USUARIO_EXTERNO',
] as const;
export type UserRole = (typeof ROLES)[number];

const nomeSchema = z.string().min(3, 'Nome deve ter pelo menos 3 caracteres');

const emailSchema = z.string().email('Email inválido');

const senhaSchema = z
  .string()
  .min(8, 'A senha deve ter no mínimo 8 caracteres')
  .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
  .regex(/\d/, 'A senha deve conter pelo menos um número');

const documentoFiscalSchema = z
  .string()
  .min(1, 'CPF é obrigatório')
  .refine(value => cpf.isValid(value), {
    message: 'CPF inválido',
  });

const matriculaSchema = z.string().min(1, 'Matrícula é obrigatória');

const telefoneSchema = z.string().refine(
  val => isValidPhoneNumber(val, 'BR'),
  {
    message: 'Telefone inválido (Informe o DDD + Número)',
  },
);

const instituicaoIdSchema = z.string({
  required_error: 'Por favor, selecione uma instituição.',
});

const fotoPerfilSchema = z.string().url('URL inválida').optional().or(z.literal(''));

export const signInSchema = z.object({
  email: emailSchema,
  senha: z.string().min(1, 'Senha é obrigatória'),
});

export const signUpSchema = z
  .object({
    nome: nomeSchema,
    email: emailSchema,
    senha: senhaSchema,
    confirmSenha: z.string(),

    documentoFiscal: documentoFiscalSchema,
    matricula: matriculaSchema,
    telefone: telefoneSchema,
    instituicaoId: instituicaoIdSchema,

    fotoPerfil: fotoPerfilSchema,
    cargosNome: z.enum(ROLES),
  })
  .refine(data => data.senha === data.confirmSenha, {
    message: 'As senhas não coincidem',
    path: ['confirmSenha'],
  });

export const internalSignInSchema = z.object({
  ldapUsername: z.string().min(1, 'Login é obrigatório'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

export const onboardingSchema = z.object({
  onboardingToken: z.string().min(1, 'Token de onboarding ausente'),
  nome: nomeSchema,
  email: emailSchema,
  documentoFiscal: documentoFiscalSchema,
  matricula: matriculaSchema,
  telefone: telefoneSchema,
});

export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
export type InternalSignInFormValues = z.infer<typeof internalSignInSchema>;
export type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export type SignInRequest = SignInFormValues;

export type SignUpRequest = Omit<
  SignUpFormValues,
    'confirmSenha' | 'cargosNome'
> & {
  matricula: string;
  instituicaoId: string;
  refreshTokenEnabled: boolean;
  cargosNome: string[];
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

export type AuthState = {
  user: UserProfile | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  setAuth: (user: UserProfile) => void;
  clearAuth: () => void;
};

export type MeResponse = {
  data: UserProfile | null;
  error: null | errorResponse;
};
