'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductResponseDtoType } from '@/interface/dto/product.dto';
import { SimulationResponseDtoType } from '@/interface/dto/loan.dto';
import { ProductMapper } from '@/interface/mappers/product.mapper';

export default function SimulacaoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicantId = searchParams.get('applicantId');
  const productId = searchParams.get('productId');
  const initialValor = searchParams.get('valor');
  const initialParcelas = searchParams.get('parcelas');

  const [product, setProduct] = useState<ProductResponseDtoType | null>(null);
  const [simulation, setSimulation] = useState<SimulationResponseDtoType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [valor, setValor] = useState(initialValor || '');
  const [parcelas, setParcelas] = useState(initialParcelas || '');

  useEffect(() => {
    if (!applicantId || !productId) {
      setError('Parâmetros inválidos');
      return;
    }

    async function fetchProduct() {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const products = await response.json();
          const selectedProduct = products.find((p: ProductResponseDtoType) => p.id === productId);
          setProduct(selectedProduct);
        }
      } catch (err) {
        setError('Erro ao carregar produto');
      }
    }

    fetchProduct();
  }, [applicantId, productId]);

  const formatCurrency = (value: string): string => {
    const cleanValue = value.replace(/\D/g, '');
    const number = parseInt(cleanValue) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(number);
  };

  const handleValorChange = (value: string) => {
    setValor(formatCurrency(value));
  };

  const handleSimulate = async () => {
    if (!valor || !parcelas) {
      setError('Preencha todos os campos');
      return;
    }

    const valorNumber = parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.'));
    const parcelasNumber = parseInt(parcelas);

    if (valorNumber <= 0 || parcelasNumber <= 0) {
      setError('Valores devem ser positivos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/loan/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicantId,
          productId,
          valor: valorNumber,
          parcelas: parcelasNumber
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erro ao simular empréstimo');
      }

      const simulationData = await response.json();
      setSimulation(simulationData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleContract = async () => {
    if (!simulation) return;

    const valorNumber = parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.'));
    const parcelasNumber = parseInt(parcelas);

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/loan/contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicantId,
          productId,
          valor: valorNumber,
          parcelas: parcelasNumber
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erro ao contratar empréstimo');
      }

      const contractData = await response.json();
      router.push(`/sucesso?contractId=${contractData.contractId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  if (error && !product) {
    return (
      <div className="text-center">
        <div className="text-error-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => router.push('/ofertas')} 
          className="btn btn-primary"
        >
          Voltar às Ofertas
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Simulação de Empréstimo
        </h1>
        {product && (
          <p className="text-gray-600">
            Produto: <span className="font-semibold">{product.nome}</span>
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Simulation Form */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Dados da Simulação
          </h2>
          
          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Valor do Empréstimo</label>
              <input
                type="text"
                className="input"
                value={valor}
                onChange={(e) => handleValorChange(e.target.value)}
                placeholder="R$ 0,00"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Número de Parcelas</label>
              <input
                type="number"
                className="input"
                value={parcelas}
                onChange={(e) => setParcelas(e.target.value)}
                min={product?.minParcelas || 1}
                max={product?.maxParcelas || 120}
                placeholder="Ex: 12"
              />
              {product && (
                <p className="text-sm text-gray-500 mt-1">
                  Mínimo: {product.minParcelas} parcelas • Máximo: {product.maxParcelas} parcelas
                </p>
              )}
            </div>

            {error && (
              <div className="bg-error-50 border border-error-200 rounded-lg p-4">
                <p className="text-error-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleSimulate}
              disabled={loading || !valor || !parcelas}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Simulando...
                </div>
              ) : (
                'Simular'
              )}
            </button>
          </div>
        </div>

        {/* Simulation Results */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Resultado da Simulação
          </h2>
          
          {simulation ? (
            <div className="space-y-4">
              <div className="bg-primary-50 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(simulation.parcela)}
                  </div>
                  <p className="text-gray-600">Valor da Parcela</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-semibold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(simulation.total)}
                  </div>
                  <p className="text-sm text-gray-600">Total a Pagar</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-lg font-semibold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(simulation.juros)}
                  </div>
                  <p className="text-sm text-gray-600">Juros Totais</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-lg font-semibold text-gray-900">
                  {(simulation.taxaEfetivaMes * 100).toFixed(4)}% ao mês
                </div>
                <p className="text-sm text-gray-600">Taxa Efetiva Mensal</p>
              </div>

              <button
                onClick={handleContract}
                disabled={loading}
                className="btn btn-success w-full py-3 text-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Contratando...
                  </div>
                ) : (
                  'Contratar Empréstimo'
                )}
              </button>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <p>Preencha os dados e clique em &quot;Simular&quot; para ver o resultado</p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <button 
          onClick={() => router.push('/ofertas')} 
          className="btn btn-secondary"
        >
          Voltar às Ofertas
        </button>
      </div>
    </div>
  );
}
