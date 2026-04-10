'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuthStore } from '@/features/auth/store/authStore';
import { authService } from '@/features/auth/services/authService';
import { 
  profileFormSchema, 
  type ProfileFormValues 
} from '@/features/auth/schemas/profileSchema';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      nome: user?.nome || '',
      email: user?.email || '',
      matricula: user?.matricula ? String(user.matricula) : '',
      telefone: user?.telefone || '',
      instituicaoId: user?.instituicao?.id || '',
      cargosId: user?.cargos?.map(c => c.id) || [],
      fotoPerfil: user?.fotoPerfil || '',
      senha: '',
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      if (!user?.id) return;

      const payload = { ...data };
      if (!payload.senha) delete payload.senha;

      const response = await authService.updateUser(user.id, payload);
      
      if (response.data.data) {
        setAuth(response.data.data); 
      }
      
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error('Erro ao salvar alterações. Verifique os dados.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto mt-10 border border-gray-100">
      <header className="mb-8 border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Meu Perfil</h2>
        <p className="text-sm text-gray-500">Gerencie suas informações pessoais e de acesso.</p>
      </header>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Nome Completo</label>
            <input 
              {...register('nome')} 
              className={`border p-2 rounded-md outline-none transition-all ${errors.nome ? 'border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 focus:ring-2 focus:ring-blue-500'}`} 
            />
            {errors.nome && <span className="text-red-500 text-xs font-medium">{errors.nome.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Matrícula</label>
            <input 
              {...register('matricula')} 
              className="border p-2 rounded-md bg-gray-50 text-gray-500 border-gray-300 cursor-not-allowed" 
              readOnly
            />
            {errors.matricula && <span className="text-red-500 text-xs font-medium">{errors.matricula.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">E-mail Institucional</label>
            <input 
              {...register('email')} 
              className={`border p-2 rounded-md outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-300'}`} 
            />
            {errors.email && <span className="text-red-500 text-xs font-medium">{errors.email.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Telefone</label>
            <input 
              {...register('telefone')} 
              className="border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="(00) 00000-0000"
            />
            {errors.telefone && <span className="text-red-500 text-xs font-medium">{errors.telefone.message}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">Alterar Senha</label>
            <input 
              type="password" 
              {...register('senha')} 
              placeholder="Deixe em branco para não alterar"
              className="border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500" 
            />
            {errors.senha && <span className="text-red-500 text-xs font-medium">{errors.senha.message}</span>}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-10 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}