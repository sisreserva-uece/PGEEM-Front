import { useMutation } from '@tanstack/react-query';
import apiClient from '@/lib/api/apiClient';

export function useDownloadRelatorioPdf() {
  return useMutation({
    mutationFn: async (params: { 
      mesInicial?: number; 
      anoInicial?: number;
      mesFinal?: number;
      anoFinal?: number;
      ids: string[]; 
      tipo: 'espacos' | 'equipamentos' 
    }) => {
      const prefixo = params.tipo === 'espacos' ? 'espaco' : 'equipamento';
      const queryParamName = params.tipo === 'espacos' ? 'espacoIds' : 'equipamentoIds';
    
      const response = await apiClient.get(`/${prefixo}/estatisticas/pdf`, {
        params: {
          mesInicial: params.mesInicial,
          anoInicial: params.anoInicial,
          mesFinal: params.mesFinal,
          anoFinal: params.anoFinal,
        },
        paramsSerializer: (p) => {
          const searchParams = new URLSearchParams();

          if (p.mesInicial) searchParams.append('mesInicial', p.mesInicial.toString());
          if (p.anoInicial) searchParams.append('anoInicial', p.anoInicial.toString());
          if (p.mesFinal) searchParams.append('mesFinal', p.mesFinal.toString());
          if (p.anoFinal) searchParams.append('anoFinal', p.anoFinal.toString());
          
          const queryKey = params.tipo === 'espacos' ? 'espacoIds' : 'equipamentoIds';
          console.log(`DEBUG [Service Serializer]: Usando chave "${queryKey}" para IDs:`, params.ids);
          if (params.ids && Array.isArray(params.ids)) {
            params.ids.forEach((id: string) => {
              searchParams.append(queryKey, id);
            });
          }
          
          const finalQuery = searchParams.toString();
          // LOG 3: A URL final que será enviada ao Backend
          console.log("DEBUG https://www.merriam-webster.com/dictionary/final:", `/${prefixo}/estatisticas/pdf?${finalQuery}`);
          
          return finalQuery;
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `relatorio-${prefixo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
  });
}