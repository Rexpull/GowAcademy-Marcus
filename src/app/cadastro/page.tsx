'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductResponseDtoType } from '@/interface/dto/product.dto';
import { ProductMapper } from '@/interface/mappers/product.mapper';

interface FormData {
  nome: string;
  cpf: string;
  cep: string;
  renda: string;
}

interface FormErrors {
  nome?: string;
  cpf?: string;
  cep?: string;
  renda?: string;
  general?: string;
}

export default function CadastroPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');

  const [formData, setFormData] = useState<FormData>({
    nome: '',
    cpf: '',
    cep: '',
    renda: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponseDtoType | null>(null);
  const [products, setProducts] = useState<ProductResponseDtoType[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
          
          if (productId) {
            const product = data.find((p: ProductResponseDtoType) => p.id === productId);
            if (product) {
              setSelectedProduct(product);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
      }
    }

    fetchProducts();
  }, [productId]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!isValidCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }

    if (!formData.cep.trim()) {
      newErrors.cep = 'CEP é obrigatório';
    } else if (!isValidCEP(formData.cep)) {
      newErrors.cep = 'CEP inválido';
    }

    if (!formData.renda.trim()) {
      newErrors.renda = 'Renda é obrigatória';
    } else {
      // Remove formatação de moeda para validar
      const cleanRenda = formData.renda.replace(/[^\d,]/g, '').replace(',', '.');
      const renda = parseFloat(cleanRenda);
      if (isNaN(renda) || renda <= 0 || cleanRenda === '') {
        newErrors.renda = 'Renda deve ser um valor positivo';
      }
    }

    if (!selectedProduct) {
      newErrors.general = 'Selecione um produto';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidCPF = (cpf: string): boolean => {
    const cleanCpf = cpf.replace(/\D/g, '');
    if (cleanCpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cleanCpf.charAt(10))) return false;

    return true;
  };

  const isValidCEP = (cep: string): boolean => {
    const cleanCep = cep.replace(/\D/g, '');
    return cleanCep.length === 8;
  };

  const formatCPF = (value: string): string => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatCEP = (value: string): string => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const formatCurrency = (value: string): string => {
    if (!value) return '';
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) return '';
    const number = parseInt(cleanValue) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(number);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    let formattedValue = value;

    switch (field) {
      case 'cpf':
        formattedValue = formatCPF(value);
        break;
      case 'cep':
        formattedValue = formatCEP(value);
        break;
      case 'renda':
        formattedValue = formatCurrency(value);
        break;
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const renda = parseFloat(formData.renda.replace(/[^\d,]/g, '').replace(',', '.'));
      
      const response = await fetch('/api/applicants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome.trim(),
          cpf: formData.cpf.replace(/\D/g, ''),
          cep: formData.cep.replace(/\D/g, ''),
          renda
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Erro ao cadastrar solicitante');
      }

      const applicant = await response.json();
      
      // Redirect to offers page
      router.push(`/ofertas?applicantId=${applicant.id}&productId=${selectedProduct?.id}`);
      
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Solicitar Empréstimo
        </h1>
        <p className="text-gray-600">
          Preencha os dados abaixo para iniciar sua solicitação
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Selection */}
          <div className="form-group">
            <label className="form-label">Produto</label>
            <div className="grid gap-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedProduct?.id === product.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-gray-900">{product.nome}</h3>
                      <p className="text-sm text-gray-600">
                        {ProductMapper.formatTaxa(product.taxaMesBase)} • {ProductMapper.formatParcelas(product.minParcelas, product.maxParcelas)}
                      </p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedProduct?.id === product.id
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedProduct?.id === product.id && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="form-group">
            <label htmlFor="nome" className="form-label">
              Nome Completo
            </label>
            <input
              type="text"
              id="nome"
              className={`input ${errors.nome ? 'input-error' : ''}`}
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              placeholder="Digite seu nome completo"
            />
            {errors.nome && <p className="form-error">{errors.nome}</p>}
          </div>

          {/* CPF */}
          <div className="form-group">
            <label htmlFor="cpf" className="form-label">
              CPF
            </label>
            <input
              type="text"
              id="cpf"
              className={`input ${errors.cpf ? 'input-error' : ''}`}
              value={formData.cpf}
              onChange={(e) => handleInputChange('cpf', e.target.value)}
              placeholder="000.000.000-00"
              maxLength={14}
            />
            {errors.cpf && <p className="form-error">{errors.cpf}</p>}
          </div>

          {/* CEP */}
          <div className="form-group">
            <label htmlFor="cep" className="form-label">
              CEP
            </label>
            <input
              type="text"
              id="cep"
              className={`input ${errors.cep ? 'input-error' : ''}`}
              value={formData.cep}
              onChange={(e) => handleInputChange('cep', e.target.value)}
              placeholder="00000-000"
              maxLength={9}
            />
            {errors.cep && <p className="form-error">{errors.cep}</p>}
          </div>

          {/* Income */}
          <div className="form-group">
            <label htmlFor="renda" className="form-label">
              Renda Mensal
            </label>
            <input
              type="text"
              id="renda"
              className={`input ${errors.renda ? 'input-error' : ''}`}
              value={formData.renda}
              onChange={(e) => handleInputChange('renda', e.target.value)}
              placeholder="R$ 0,00"
            />
            {errors.renda && <p className="form-error">{errors.renda}</p>}
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="bg-error-50 border border-error-200 rounded-lg p-4">
              <p className="text-error-600">{errors.general}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-3 text-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processando...
              </div>
            ) : (
              'Continuar'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
