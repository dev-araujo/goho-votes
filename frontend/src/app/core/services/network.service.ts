import { Injectable, signal, inject } from '@angular/core';

import amoyGoHorse from '../../../../contracts/amoy/GoHoVoting.json';
import mainnetGoHorse from '../../../../contracts/mainnet/GoHorse.json'; // TODO: trocar

export type Network = 'amoy' | 'mainnet';

interface ContractConfig {
  abi: any;
  explorerUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private readonly CONTRACT_CONFIGS: Record<Network, ContractConfig> = {
    amoy: {
      abi: amoyGoHorse.abi,
      explorerUrl: 'https://amoy.polygonscan.com',
    },
    mainnet: {
      abi: mainnetGoHorse.abi,
      explorerUrl: 'https://polygonscan.com',
    },
  };

  activeNetwork = signal<Network>('amoy');

  constructor() {}

  setNetwork(network: Network): void {
    this.activeNetwork.set(network);
  }

  getContractConfig(): ContractConfig {
    return this.CONTRACT_CONFIGS[this.activeNetwork()];
  }

  getContractAbi(): any {
    return this.getContractConfig().abi;
  }

  getExplorerUrl(): string {
    return this.CONTRACT_CONFIGS[this.activeNetwork()].explorerUrl;
  }
}
