'use client';

import { useAuthStore } from '@/features/auth/store/authStore';

export default function DashboardPage() {
  const { user } = useAuthStore();
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Bem-vindo!</h2>
            <p className="text-green-600">Você está logado no sistema de gestão de espaços.</p>
          </div>
          {user && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">Informações do Usuário</h2>
              <div className="space-y-1 text-blue-600">
                <p>
                  <strong>Email:</strong>
                  {' '}
                  {user.email}
                </p>
                <p>
                  <strong>Nome:</strong>
                  {' '}
                  {user.nome}
                </p>
                {user.matricula && (
                  <p>
                    <strong>Matrícula:</strong>
                    {' '}
                    {user.matricula}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
