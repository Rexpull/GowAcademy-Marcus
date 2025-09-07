'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OfertasPage() {
  const router = useRouter();
  
  const [applicantId, setApplicantId] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obter parâmetros do URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const appId = urlParams.get('applicantId');
      const prodId = urlParams.get('productId');
      
      setApplicantId(appId);
      setProductId(prodId);
      
      // Se temos parâmetros válidos, buscar ofertas
      if (appId && prodId) {
        fetchOffers(appId, prodId);
      } else {
        setError('Parâmetros inválidos');
        setLoading(false);
      }
    }
  }, []);

  const fetchOffers = async (appId: string, prodId: string) => {
    try {
      const response = await fetch('/api/credit/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicantId: appId,
          productId: prodId
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar ofertas');
      }

      const data = await response.json();
      setOffers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

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
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => router.push('/cadastro')} 
          className="btn btn-primary"
        >
          Voltar ao Cadastro
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Ofertas de Crédito
        </h1>
        <p className="text-gray-600">
          Solicitante: {applicantId} | Produto: {productId}
        </p>
      </div>

      {offers.length === 0 ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma oferta disponível</h2>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {offers.map((offer: any, index: number) => (
            <div key={index} className="card hover:shadow-lg transition-shadow">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">
                  Oferta {index + 1}
                </h3>
                <div className="text-3xl font-bold text-primary-600 mb-2">
                  {formatCurrency(offer.valor)}
                </div>
                <div className="text-sm text-gray-600">
                  Parcelas: {offer.parcelasSugeridas?.join(', ')}
                </div>
              </div>
              
              {offer.observacoes && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {offer.observacoes}
                  </p>
                </div>
              )}
              
              <button
                onClick={() => router.push(`/simulacao?applicantId=${applicantId}&productId=${productId}&valor=${offer.valor}&parcelas=${Math.min(...offer.parcelasSugeridas)}`)}
                className="btn btn-primary w-full"
              >
                Simular Empréstimo
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <button 
          onClick={() => router.push('/cadastro')} 
          className="btn btn-secondary"
        >
          Voltar ao Cadastro
        </button>
      </div>
    </div>
  );
}