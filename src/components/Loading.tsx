'use client';

import type React from 'react';

export function Loading() {
  return (
    <div>
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Aguarde um momento...</p>
    </div>
  );
}
