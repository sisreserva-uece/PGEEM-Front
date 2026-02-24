type ApiErrorShape = {
  error?: string | { name?: string; message?: string };
  message?: string;
};

export function extractErrorMessage(
  data: unknown,
  fallback = 'Erro inesperado.',
): string {
  const d = data as ApiErrorShape;

  if (typeof d?.error === 'string') {
    return d.error;
  }
  if (typeof d?.error?.message === 'string') {
    return d.error.message;
  }
  if (typeof d?.message === 'string') {
    return d.message;
  }

  return fallback;
}
