'use client';

import { Button } from '@/components/ui/button';
import { authApi } from '@/lib/authApi';
import { useAuthStore } from '@/lib/authStore';
import { useRouter } from '@/lib/i18nNavigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { isAuthenticated, user, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.push('/');
    }
  }, [isAuthenticated, token, router]);

  const handleLogout = () => {
    authApi.logout();
    router.push('/');
  };

  if (!isAuthenticated) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <Button onClick={handleLogout} variant="outline">
              Sair
            </Button>
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
                  <p>
                    <strong>Cargo:</strong>
                    {' '}
                    {user.role}
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

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-md font-semibold text-gray-800 mb-2">Token de Autenticação</h3>
            <p className="text-xs text-gray-600 font-mono break-all">{token}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
