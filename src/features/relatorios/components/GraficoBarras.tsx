'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const NOME_MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function GraficoBarras({ data }: { data: any[] }) {
  const formattedData = data.map(item => ({
    name: `${NOME_MESES[item.mes - 1]}/${item.ano}`,
    Solicitadas: item.reservasSolicitadas,
    Confirmadas: item.reservasConfirmadas,
  }));

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
        <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
        <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{paddingBottom: '20px'}} />
        <Bar dataKey="Solicitadas" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={25} />
        <Bar dataKey="Confirmadas" fill="#10B981" radius={[4, 4, 0, 0]} barSize={25} />
      </BarChart>
    </ResponsiveContainer>
  );
}