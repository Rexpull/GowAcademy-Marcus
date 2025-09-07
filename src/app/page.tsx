'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ProductResponseDtoType } from '@/interface/dto/product.dto';
import { ProductMapper } from '@/interface/mappers/product.mapper';

export default function HomePage() {
  const [products, setProducts] = useState<ProductResponseDtoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Erro ao carregar produtos');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <div className="text-error-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro ao carregar produtos</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Empréstimos Inteligentes
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Solicite seu empréstimo de forma rápida e segura. 
          Análise de crédito em tempo real com as melhores taxas do mercado.
        </p>
        <Link href="/cadastro" className="btn btn-primary text-lg px-8 py-3">
          Solicitar Empréstimo
        </Link>
      </div>

      {/* Products Section */}
      <div>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Nossos Produtos
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="card hover:shadow-lg transition-shadow">
              <div className="card-header">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {product.nome}
                </h3>
                <div className="text-2xl font-bold text-primary-600">
                  {ProductMapper.formatTaxa(product.taxaMesBase)}
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Parcelas:</span>
                  <span className="font-medium">
                    {ProductMapper.formatParcelas(product.minParcelas, product.maxParcelas)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {product.cetInfo}
                </div>
              </div>
              
              <Link 
                href={`/cadastro?productId=${product.id}`}
                className="btn btn-primary w-full"
              >
                Escolher {product.nome}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Por que escolher nossos empréstimos?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aprovação Rápida</h3>
            <p className="text-gray-600">
              Análise de crédito em tempo real com resposta imediata
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-success-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Taxas Competitivas</h3>
            <p className="text-gray-600">
              As melhores taxas do mercado com transparência total
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-warning-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Segurança Total</h3>
            <p className="text-gray-600">
              Seus dados protegidos com criptografia de ponta
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
