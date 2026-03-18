'use client';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const RelatorioDashboardPage = dynamic(
  () => import('@/features/relatorios/components/RelatorioDashboard'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    )
  }
);

export default function Page() {
  return <RelatorioDashboardPage />;
}