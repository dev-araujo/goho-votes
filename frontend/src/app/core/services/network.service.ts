import { Injectable, signal } from '@angular/core';

import amoyGoHorse from '../../../../contracts/amoy/GohoVoting.json';
import mainnetGoHorse from '../../../../contracts/mainnet/GoHorse.json';

export type Network = 'amoy' | 'mainnet' | 'mock';

export interface ContractConfig {
  address: string;
  abi: any;
  explorerUrl: string;
  rpcUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private readonly CONTRACT_CONFIGS: Record<Network, ContractConfig | null> = {
    amoy: {
      address: '0x5cF749F8061Ec686aa5bdDcD6724aaEc4DB42D46',
      abi: amoyGoHorse.abi,
      explorerUrl: 'https://amoy.polygonscan.com/address/',
      rpcUrl: 'https://rpc-amoy.polygon.technology/',
    },
    mainnet: {
      address: '0xMAINNET_CONTRACT_ADDRESS', // TODO: Adicionar endereço do contrato mainnet
      abi: mainnetGoHorse.abi,
      explorerUrl: 'https://polygonscan.com/address/',
      rpcUrl: 'https://polygon-rpc.com/',
    },
    mock: null, 
  };

  activeNetwork = signal<Network>(this.getInitialNetwork());

  constructor() {}

  private getInitialNetwork(): Network {
    if (typeof window !== 'undefined') {
      const savedNetwork = localStorage.getItem('activeNetwork') as Network;
      return savedNetwork && savedNetwork in this.CONTRACT_CONFIGS ? savedNetwork : 'amoy';
    }
    return 'amoy';
  }

  setNetwork(network: Network): void {
    this.activeNetwork.set(network);
    if (typeof window !== 'undefined') {
      localStorage.setItem('activeNetwork', network);
    }
  }

  getContractConfig(): ContractConfig {
    const config = this.CONTRACT_CONFIGS[this.activeNetwork()];
    if (!config) {
      throw new Error(`Configuração de contrato não encontrada para a rede: ${this.activeNetwork()}`);
    }
    return config;
  }

  getRpcUrl(): string {
    const config = this.CONTRACT_CONFIGS[this.activeNetwork()];
    return config ? config.rpcUrl : '';
  }

  getExplorerUrl(): string {
    const config = this.CONTRACT_CONFIGS[this.activeNetwork()];
    return config ? `${config.explorerUrl}${config.address}` : '';
  }
}
