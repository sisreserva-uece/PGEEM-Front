import { Archivo_Black, Inter } from 'next/font/google';
import '@fontsource/inter';

export const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '300', '200', '400', '500', '600', '700', '800'],
  display: 'swap',
});

export const archivoBlack = Archivo_Black({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
});
