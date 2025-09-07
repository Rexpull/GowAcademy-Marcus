export interface AddressLike {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
}

export interface ICepGateway {
  /**
   * Busca endereço por CEP
   * @param zip CEP a ser consultado
   * @returns Dados do endereço ou null se não encontrado
   */
  getAddressByZip(zip: string): Promise<AddressLike | null>;
}
