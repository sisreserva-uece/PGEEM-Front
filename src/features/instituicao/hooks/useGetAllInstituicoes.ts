import type { Instituicao } from '../types';
import { useQuery } from '@tanstack/react-query';
import { fetchAllPaginated } from '@/lib/api/fetchAllPaginated';

const allInstituicoesKeys = {
  all: ['allInstituicoes'] as const,
};

/**
 * Fetches ALL institutions by iterating through all pages.
 * @returns A useQuery result containing a single array of all institutions.
 */
export function useGetAllInstituicoes() {
  return useQuery({
    queryKey: allInstituicoesKeys.all,
    queryFn: () => fetchAllPaginated<Instituicao>('/instituicao', {}),
  });
}
