import { AppProvider } from '@/context/app.context';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Smart Budget',
  description: '',
  
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <body
        className={inter.className}
        style={{
          backgroundImage: `url(/bg.jpg)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          minHeight: '100vh'
        }}>
        <AppProvider>
          {children}
        </AppProvider>

      </body>
    </html>
  )
}
