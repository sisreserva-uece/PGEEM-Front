'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/store/authStore';

import { editarPerfilSchema } from '../validations/editarPerfilSchema';
import { PerfilFormValues, ProfileUpdatePayload } from '../types';
import { useUpdateMe } from '../services/editarPerfilService';
import { formatPhone } from '../utils/formatters';

export function EditarPageClient() {
  const user = useAuthStore((state) => state.user);

  const { mutateAsync, isPending: isSaving } = useUpdateMe();

  const [mostrarCamposSenha, setMostrarCamposSenha] = useState(false);

  const { 
    register, 
    handleSubmit, 
    setValue,
    reset,
    formState: { errors } 
  } = useForm<PerfilFormValues>({
    resolver: zodResolver(editarPerfilSchema),
    defaultValues: {
      nome: user?.nome || '',
      email: user?.email || '',
      matricula: user?.matricula ? String(user.matricula) : '',
      telefone: user?.telefone || '',
      instituicaoId: user?.instituicao?.id || '',
      cargosId: user?.cargos?.map((c: any) => c.nome) || [],
      fotoPerfil: user?.fotoPerfil || '',
      senha: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        nome: user.nome || '',
        email: user.email || '',
        matricula: user.matricula ? String(user.matricula) : '',
        telefone: user.telefone || '',
        instituicaoId: user.instituicao?.id || '',
        cargosId: user.cargos?.map((c: any) => c.nome) || [],
        fotoPerfil: user.fotoPerfil || '',
        senha: '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: PerfilFormValues) => {
    try {
      if (!user?.id) {
        toast.error('Usuário não autenticado.');
        return;
      }

      const { confirmarSenha, senha, ...restoDosDados } = data;

      const payload: ProfileUpdatePayload = { 
        ...restoDosDados,
        matricula: data.matricula ?? '',
        telefone: data.telefone ?? '',
        instituicaoId: data.instituicaoId ?? '',
        cargosId: data.cargosId ?? [],
      }

      if (senha) {
        payload.senha = senha;
      }

      await mutateAsync(payload as any); 
      
      toast.success('Perfil atualizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      const mensagem = error.response?.data?.message || 'Erro ao salvar alterações. Verifique os dados e tente novamente.';
      toast.error(mensagem);
    }
  };

  if (!user) {
    return <div className="p-6 text-center text-gray-500">Carregando dados do perfil...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto mt-10 border border-gray-100">
      <header className="mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Dados Pessoais</h2>
        <p className="text-sm text-gray-500">Gerencie suas informações de identificação e acesso.</p>
      </header>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          <div className="flex flex-col gap-1 md:col-span-2">
            <label className="text-sm font-semibold text-gray-700">Nome Completo</label>
            <input 
              {...register('nome')} 
              className={`border p-2 rounded-md outline-none transition-all ${errors.nome ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-green-600'}`} 
            />
            {errors.nome && <span className="text-red-500 text-xs font-medium">{errors.nome.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Matrícula</label>
            <input 
              {...register('matricula')} 
              className="border p-2 rounded-md bg-gray-50 text-gray-500 border-gray-300 cursor-not-allowed" 
              readOnly
              title="A matrícula não pode ser alterada"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Cargos / Perfil de Acesso</label>
            <input 
              value={user?.cargos?.map((c: any) => c.nome.replace('_', ' ')).join(', ') || 'Nenhum cargo'} 
              className="border p-2 rounded-md bg-gray-50 text-gray-500 border-gray-300 cursor-not-allowed" 
              readOnly
              title="Seus níveis de acesso são gerenciados pelo administrador"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">E-mail Institucional</label>
            <input 
              {...register('email')} 
              className={`border p-2 rounded-md outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-green-600'}`} 
            />
            {errors.email && <span className="text-red-500 text-xs font-medium">{errors.email.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Telefone</label>
            <input 
              {...register('telefone')} 
              onChange={(e) => {
                const formatted = formatPhone(e.target.value);
                setValue('telefone', formatted);
              }}
              className="border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-green-600" 
              placeholder="(00) 00000-0000"
            />
            {errors.telefone && <span className="text-red-500 text-xs font-medium">{errors.telefone.message}</span>}
          </div>

          <div className="md:col-span-2 pt-6 border-t border-gray-200 mt-2">
            <button
              type="button"
              onClick={() => {
                setMostrarCamposSenha(!mostrarCamposSenha);
                if (mostrarCamposSenha) {
                  setValue('senha', '');
                  setValue('confirmarSenha', '');
                }
              }}
              className="text-sm font-semibold text-green-600 hover:text-green-700 hover:underline transition-all flex items-center gap-2"
            >
              {mostrarCamposSenha ? 'Cancelar alteração de senha' : 'Quer alterar sua senha?'}
            </button>
          </div>

          {mostrarCamposSenha && (
            <>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Nova Senha</label>
                <input 
                  type="password" 
                  {...register('senha')} 
                  autoComplete="new-password"
                  placeholder="Digite a nova senha"
                  className={`border p-2 rounded-md outline-none transition-all ${errors.senha ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-green-600'}`} 
                />
                {errors.senha && <span className="text-red-500 text-xs font-medium">{errors.senha.message}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-gray-700">Confirmar Nova Senha</label>
                <input 
                  type="password" 
                  {...register('confirmarSenha')} 
                  autoComplete="new-password"
                  placeholder="Repita a nova senha"
                  className={`border p-2 rounded-md outline-none transition-all ${errors.confirmarSenha ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-green-600'}`} 
                />
                {errors.confirmarSenha && <span className="text-red-500 text-xs font-medium">{errors.confirmarSenha.message}</span>}
              </div>
            </>
          )}
        </div>

        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-green-600 text-white px-10 py-2.5 rounded-lg font-bold hover:bg-green-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
          >
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}