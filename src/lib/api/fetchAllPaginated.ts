import type { PaginatedResponse } from '@/types/api';
import apiClient from './apiClient';

export async function fetchAllPaginated<T>(
  endpoint: string,
  initialParams: Record<string, any>,
): Promise<T[]> {
  let allItems: T[] = [];
  let currentPage = 0;
  let totalPages = 1;
  while (currentPage < totalPages) {
    const params = { ...initialParams, page: currentPage };
    const response = await apiClient.get<{ data: PaginatedResponse<T> }>(endpoint, { params });
    const pageData = response.data.data;
    if (pageData && pageData.content) {
      allItems = [...allItems, ...pageData.content];
    }
    if (currentPage === 0) {
      totalPages = pageData.totalPages;
    }
    currentPage++;
  }
  return allItems;
}
