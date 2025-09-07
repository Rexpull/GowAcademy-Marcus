import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GowAcademy Loans - Empréstimos Inteligentes',
  description: 'Sistema de empréstimos com análise de crédito em tempo real',
  keywords: 'empréstimo, crédito, financiamento, análise de crédito',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold text-primary-600">
                    GowAcademy Loans
                  </h1>
                </div>
                <nav className="flex space-x-4">
                  <a href="/" className="text-gray-600 hover:text-gray-900">
                    Início
                  </a>
                  <a href="/cadastro" className="text-gray-600 hover:text-gray-900">
                    Solicitar Empréstimo
                  </a>
                </nav>
              </div>
            </div>
          </header>
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          
          <footer className="bg-white border-t mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center text-gray-600">
                <p>&copy; 2024 GowAcademy Loans. Todos os direitos reservados.</p>
                <p className="mt-2 text-sm">
                  Sistema de empréstimos com arquitetura de cebola (Onion Architecture)
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
