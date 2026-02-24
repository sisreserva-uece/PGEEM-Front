import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api/apiClient';

export function useDownloadRelatorioPdf() {
  return useMutation({
    mutationFn: async (params: { 
      mes?: number; 
      ano?: number;
      ids: string[]; 
      tipo: 'espacos' | 'equipamentos' 
    }) => {

      const prefixo = params.tipo === 'espacos' ? 'espaco' : 'equipamento';
      const queryParamName = params.tipo === 'espacos' ? 'espacoIds' : 'equipamentoIds';

      const response = await apiClient.get(`/${prefixo}/estatisticas/pdf`, {
        params: {
          mes: params.mes,
          ano: params.ano,
          [queryParamName]: params.ids,
        },
        paramsSerializer: (p) => {
          const searchParams = new URLSearchParams();
          
          if (p.mes !== undefined && p.mes !== null) searchParams.append('mes', p.mes.toString());
          if (p.ano !== undefined && p.ano !== null) searchParams.append('ano', p.ano.toString());
          
          const queryParamName = params.tipo === 'espacos' ? 'espacoIds' : 'equipamentoIds';
          if (Array.isArray(p.ids)) {
            p.ids.forEach((id: string) => searchParams.append(queryParamName, id));
          }
          
          return searchParams.toString();
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio-${prefixo}-${params.mes}-${params.ano}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
}