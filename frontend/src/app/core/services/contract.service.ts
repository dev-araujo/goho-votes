import { Injectable, inject } from '@angular/core';
import {
  Contract,
  JsonRpcProvider,
  TransactionReceipt,
  formatUnits,
} from 'ethers';
import { Observable, forkJoin, from, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { NetworkService } from './network.service';
import { WalletService } from './wallet.service';
import { ContractConstants, PollDetails, PollOption,CreatePollData } from '../models/contract.model';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private networkService = inject(NetworkService);
  private walletService = inject(WalletService);

  private readProvider: JsonRpcProvider;

  constructor() {
    this.readProvider = new JsonRpcProvider(
      'https://rpc-amoy.polygon.technology/'
    );
  }

  private getReadContract(): Contract {
    const config = this.networkService.getContractConfig();
    const contractAddress = config.explorerUrl.split('/').pop() as string;
    const contractAbi = config.abi;
    return new Contract(contractAddress, contractAbi, this.readProvider);
  }

  private getWriteContract(): Contract | null {
    const signer = this.walletService.signer();
    if (!signer) {
      console.error('Operação de escrita requer uma carteira conectada.');
      return null;
    }
    const config = this.networkService.getContractConfig();
    const contractAddress = config.explorerUrl.split('/').pop() as string;
    const contractAbi = config.abi;
    return new Contract(contractAddress, contractAbi, signer);
  }

  //MÉTODOS DE LEITURA (VIEW)
  getRulesPolls(): Observable<ContractConstants> {
    const contract = this.getReadContract();
    const constants$ = {
      minCreate: from(
        contract['MINIMUM_GOHO_TO_CREATE_POLL']() as Promise<bigint>
      ),
      minVote: from(contract['MINIMUM_GOHO_TO_VOTE']() as Promise<bigint>),
      maxDuration: from(contract['MAX_POLL_DURATION']() as Promise<bigint>),
    };
    return forkJoin(constants$).pipe(
      map(({ minCreate, minVote, maxDuration }) => {
        const secondsInADay = 86400; 

        return {
          minimumGohoToCreatePoll: formatUnits(minCreate, 18),
          minimumGohoToVote: formatUnits(minVote, 18),
          maxPollDurationInDays: Number(maxDuration) / secondsInADay,
        };
      }),
      catchError(this.handleError)
    );
  }
 

  getPollCount(): Observable<number> {
    const contract = this.getReadContract();
    const promise = contract['getPollCount']() as Promise<bigint>;
    return from(promise).pipe(
      map((count) => Number(count)),
      catchError(this.handleError)
    );
  }

  getPollDetails(
    pollId: number,
    offset: number,
    limit: number
  ): Observable<PollDetails> {
    const contract = this.getReadContract();
    const promise = contract['getPollDetails'](
      pollId,
      offset,
      limit
    ) as Promise<any>;

    return from(promise).pipe(
      map((result) => {
        const [
          id,
          title,
          creator,
          description,
          optionDescriptions,
          optionVoteCounts,
          deadline,
          active,
          totalVotePowerCast,
          totalOptions,
        ] = result;

        const options: PollOption[] = optionDescriptions.map(
          (desc: string, index: number) => ({
            description: desc,
            voteCount: formatUnits(optionVoteCounts[index], 18),
          })
        );

        return {
          id: Number(id),
          title,
          creator,
          description,
          options,
          deadline: new Date(Number(deadline) * 1000),
          active,
          totalVotePowerCast: formatUnits(totalVotePowerCast, 18),
          totalOptions: Number(totalOptions),
        };
      }),
      catchError(this.handleError)
    );
  }

  hasVoted(pollId: number, address: string): Observable<boolean> {
    const contract = this.getReadContract();
    const promise = contract['hasVoted'](pollId, address) as Promise<boolean>;
    return from(promise).pipe(catchError(this.handleError));
  }


  private getAllPolls(): Observable<PollDetails[]> {
    return this.getPollCount().pipe(
      switchMap((pollCount) => {
        if (pollCount === 0) {
          return of([]);
        }
        const pollIds = Array.from({ length: pollCount }, (_, i) => i);

        const pollObservables = pollIds.map((id) =>
          this.getPollDetails(id, 0, 100) 
        );

        return forkJoin(pollObservables);
      }),
      catchError(this.handleError)
    );
  }

  
  getOpenPolls(): Observable<PollDetails[]> {
    return this.getAllPolls().pipe(
      map((polls) => polls.filter((p) => p.active && p.id !== 1).sort((a, b) => b.id - a.id)) 
    );
  }

  getClosedPolls(): Observable<PollDetails[]> {
    return this.getAllPolls().pipe(
      map((polls) => polls.filter((p) => !p.active).sort((a, b) => b.id - a.id)) 
    );
  }

  // MÉTODOS DE ESCRITA
  createPoll(
    pollData: CreatePollData
  ): Observable<TransactionReceipt> {
    const contract = this.getWriteContract();
    if (!contract) {
      return throwError(
        () => new Error('Criação de enquete requer uma carteira conectada.')
      );
    }

    const promise = contract['createPoll'](
      pollData.title,
      pollData.description,
      pollData.options,
      pollData.durationInDays
    ).then((tx: any) => tx.wait());

    return from(promise as Promise<TransactionReceipt>).pipe(
      catchError(this.handleError)
    );
  }

  vote(pollId: number, optionId: number): Observable<TransactionReceipt> {
    const contract = this.getWriteContract();
    if (!contract) {
      return throwError(() => new Error('Voto requer uma carteira conectada.'));
    }

    const promise = contract['vote'](pollId, optionId).then((tx: any) =>
      tx.wait()
    );
    return from(promise as Promise<TransactionReceipt>).pipe(
      catchError(this.handleError)
    );
  }

  closePoll(pollId: number): Observable<TransactionReceipt> {
    const contract = this.getWriteContract();
    if (!contract) {
      return throwError(
        () => new Error('Fechamento de enquete requer uma carteira conectada.')
      );
    }

    const promise = contract['closePoll'](pollId).then((tx: any) => tx.wait());
    return from(promise as Promise<TransactionReceipt>).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocorreu um erro no ContractService:', error);
    const errorMessage =
      error.reason ||
      error.message ||
      'Erro desconhecido na interação com o contrato.';
    return throwError(() => new Error(errorMessage));
  }
}
