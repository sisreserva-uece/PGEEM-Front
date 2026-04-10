import { z } from 'zod';

export const editarPerfilSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  matricula: z.string().optional(),
  telefone: z.string().optional(),
  instituicaoId: z.string().optional(),
  cargosId: z.array(z.string()).optional(),
  fotoPerfil: z.string().optional(),
  senha: z.string().optional().or(z.literal('')),
  confirmarSenha: z.string().optional().or(z.literal('')),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: 'As senhas não coincidem.',
  path: ['confirmarSenha'], 
});
