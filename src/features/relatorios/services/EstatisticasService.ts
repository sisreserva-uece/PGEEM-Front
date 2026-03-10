import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api/apiClient';
import { DashboardFilterValues } from '../validation/relatorioSchema';

export function useGetEstatisticas(params: DashboardFilterValues, tipo: 'espacos' | 'equipamentos', ids: string[], enabled: boolean) {
  return useQuery({
    queryKey: ['estatisticas', tipo, params, ids],
    queryFn: async () => {
      const prefixo = tipo === 'espacos' ? 'espaco' : 'equipamento';
      const idKey = tipo === 'espacos' ? 'espacoIds' : 'equipamentoIds';

      const response = await apiClient.get(`/${prefixo}/estatisticas`, {
        params: {
          ...params,
          [idKey]: ids,
        },
        paramsSerializer: (p) => {
          const searchParams = new URLSearchParams();
          Object.entries(p).forEach(([key, value]) => {
            if (value === 'all' || value === undefined || value === '') return;
            if (Array.isArray(value)) {
              value.forEach(v => searchParams.append(key, v));
            } else {
              searchParams.append(key, value.toString());
            }
          });
          return searchParams.toString();
        }
      });
      return response.data.data;
    },
    enabled: enabled && ids.length > 0
  });
}