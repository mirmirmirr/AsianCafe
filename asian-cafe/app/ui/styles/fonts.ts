import { Geist, Geist_Mono } from 'next/font/google';
import { Euphoria_Script } from 'next/font/google';

export const geistSans = Geist ({
  subsets: ['latin'],
});

export const geistMono = Geist_Mono ({
  subsets: ['latin']
});

export const euphoria = Euphoria_Script ({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-euphoria',
})