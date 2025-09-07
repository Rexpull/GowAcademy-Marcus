'use client';

import { useState, useEffect } from 'react';
import { ContractDetailResponseDtoType } from '@/interface/dto/loan.dto';
import { LoanMapper } from '@/interface/mappers/loan.mapper';

export default function SucessoPage() {
  // Obter parâmetros do URL no lado do cliente
  const [contractId, setContractId] = useState<string | null>(null);

  // Inicializar parâmetros do URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setContractId(urlParams.get('contractId'));
    }
  }, []);

  const [contract, setContract] = useState<ContractDetailResponseDtoType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Só executar quando o contractId estiver carregado
    if (contractId === null) {
      return; // Ainda carregando parâmetros
    }

    // Verificar parâmetros válidos
    if (!contractId) {
      setError('ID do contrato não fornecido');
      setLoading(false);
      return;
    }

    async function fetchContract() {
      try {
        const response = await fetch(`/api/contracts/${contractId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Erro ao carregar contrato');
        }
        
        const contractData = await response.json();
        setContract(contractData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    fetchContract();
  }, [contractId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="text-center">
        <div className="text-error-600 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Erro</h2>
        <p className="text-gray-600 mb-4">{error || 'Contrato não encontrado'}</p>
        <button 
          onClick={() => window.location.href = '/'} 
          className="btn btn-primary"
        >
          Voltar ao Início
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="text-success-600 mb-4">
          <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Empréstimo Contratado com Sucesso!
        </h1>
        <p className="text-gray-600">
          Seu contrato foi criado e está sendo processado
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contract Details */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Detalhes do Contrato
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">ID do Contrato:</span>
              <span className="font-mono text-sm">{contract.id}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`badge ${
                contract.status === 'PENDENTE' ? 'badge-warning' :
                contract.status === 'APROVADO' ? 'badge-success' : 'badge-error'
              }`}>
                {contract.status}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Data de Criação:</span>
              <span>{LoanMapper.formatDate(contract.createdAt)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Valor:</span>
              <span className="font-semibold">{LoanMapper.formatCurrency(contract.valor)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Parcelas:</span>
              <span className="font-semibold">{contract.parcelas}x</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Valor da Parcela:</span>
              <span className="font-semibold">{LoanMapper.formatCurrency(contract.parcelaCalculada)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Taxa Efetiva:</span>
              <span className="font-semibold">{LoanMapper.formatPercentage(contract.taxaEfetivaMes)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Total a Pagar:</span>
              <span className="font-semibold">{LoanMapper.formatCurrency(contract.parcelaCalculada * contract.parcelas)}</span>
            </div>
          </div>
        </div>

        {/* Applicant and Product Info */}
        <div className="space-y-6">
          {/* Applicant Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Dados do Solicitante
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Nome:</span>
                <span className="font-medium">{contract.applicant?.nome}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">CPF:</span>
                <span className="font-mono text-sm">{contract.applicant?.cpf}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Renda:</span>
                <span className="font-medium">{LoanMapper.formatCurrency(contract.applicant?.renda || 0)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Score:</span>
                <span className="font-medium">{contract.applicant?.score}</span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Produto Contratado
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Produto:</span>
                <span className="font-medium">{contract.product?.nome}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Taxa Base:</span>
                <span className="font-medium">{LoanMapper.formatPercentage(contract.product?.taxaMesBase || 0)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Parcelas:</span>
                <span className="font-medium">
                  {contract.product?.minParcelas} a {contract.product?.maxParcelas}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Snapshot */}
      <div className="card mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Endereço no Momento da Contratação
        </h3>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">CEP:</span>
                <span className="font-medium">{LoanMapper.formatCep(contract.addressCep)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Estado:</span>
                <span className="font-medium">{contract.addressState}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Cidade:</span>
                <span className="font-medium">{contract.addressCity}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Bairro:</span>
                <span className="font-medium">{contract.addressNeighborhood}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Rua:</span>
                <span className="font-medium">{contract.addressStreet}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Fonte:</span>
                <span className="font-medium">{contract.addressService}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <strong>Endereço completo:</strong> {contract.addressStreet}, {contract.addressNeighborhood}, {contract.addressCity} - {contract.addressState}
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="card mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Próximos Passos
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 text-sm font-semibold">1</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-gray-700">
                <strong>Análise do Contrato:</strong> Nossa equipe analisará seu contrato e documentos.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 text-sm font-semibold">2</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-gray-700">
                <strong>Notificação:</strong> Você receberá um e-mail com o resultado da análise.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 text-sm font-semibold">3</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-gray-700">
                <strong>Liberação:</strong> Se aprovado, o valor será creditado em sua conta.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button 
          onClick={() => window.location.href = '/'} 
          className="btn btn-primary"
        >
          Voltar ao Início
        </button>
      </div>
    </div>
  );
}
