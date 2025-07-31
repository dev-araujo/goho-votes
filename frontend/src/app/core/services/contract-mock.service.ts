import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  ContractConstants,
  PollDetails,
  CreatePollData,
} from '../models/contract.model';
import { TransactionReceipt } from 'ethers';

@Injectable({
  providedIn: 'root',
})
export class ContractMockService {
  private mockPolls: PollDetails[] = [
    {
      id: 0,
      creator: '0xMockCreator1',
      title: 'Qual o melhor sabor de pizza?',
      description: 'Vote no seu sabor de pizza favorito.',
      options: [
        { description: 'Calabresa', voteCount: '1500' },
        { description: 'Mussarela', voteCount: '2500' },
        { description: 'Frango com Catupiry', voteCount: '1000' },
      ],
      deadline: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), 
      active: true,
      totalVotePowerCast: '5',
      totalOptions: 3,
    },
    {
      id: 1,
      creator: '0xMockCreator2',
      title: 'Qual a sua linguagem de programação preferida?',
      description: 'Escolha a linguagem que você mais gosta de usar.',
      options: [
        { description: 'TypeScript', voteCount: '3000' },
        { description: 'Python', voteCount: '2000' },
        { description: 'Go', voteCount: '1200' },
      ],
      deadline: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), 
      active: false,
      totalVotePowerCast: '6200',
      totalOptions: 3,
    },
    {
        id: 2,
        creator: '0xMockCreator3',
        title: 'Próximo meetup da comunidade',
        description: 'Onde deveria ser o nosso próximo encontro?',
        options: [
          { description: 'São Paulo', voteCount: '500' },
          { description: 'Remoto', voteCount: '1500' },
        ],
        deadline: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000), 
        active: true,
        totalVotePowerCast: '2000',
        totalOptions: 2,
      },
      {
        id: 3,
        creator: '0xMockCreator4',
        title: 'Próximo meetup da comunidade',
        description: 'Onde deveria ser o nosso próximo encontro?',
        options: [
          { description: 'São Paulo', voteCount: '500' },
          { description: 'Remoto', voteCount: '1500' },
        ],
        deadline: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000), 
        active: true,
        totalVotePowerCast: '2000',
        totalOptions: 2,
      },
       {
        id: 4,
        creator: '0xMockCreator5',
        title: 'Próximo meetup da comunidade',
        description: 'Onde deveria ser o nosso próximo encontro?',
        options: [
          { description: 'São Paulo', voteCount: '500' },
          { description: 'Remoto', voteCount: '1500' },
        ],
        deadline: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000), 
        active: true,
        totalVotePowerCast: '2000',
        totalOptions: 2,
      },
  ];

  constructor() {}

  getRulesPolls(): Observable<ContractConstants> {
    const mockConstants: ContractConstants = {
      minimumGohoToCreatePoll: '1000',
      minimumGohoToVote: '100',
      maxPollDurationInDays: 30,
    };
    return of(mockConstants).pipe(delay(500));
  }

  getPollCount(): Observable<number> {
    return of(this.mockPolls.length).pipe(delay(500));
  }

  getPollDetails(
    pollId: number,
    offset: number,
    limit: number
  ): Observable<PollDetails> {
    const poll = this.mockPolls.find((p) => p.id === pollId);
    return of(poll as PollDetails).pipe(delay(500));
  }

  hasVoted(pollId: number, address: string): Observable<boolean> {
    return of(pollId === 0).pipe(delay(500));
  }

  getOpenPolls(): Observable<PollDetails[]> {
    const openPolls = this.mockPolls.filter((p) => p.active);
    return of(openPolls).pipe(delay(500));
  }

  getClosedPolls(): Observable<PollDetails[]> {
    const closedPolls = this.mockPolls.filter((p) => !p.active);
    return of(closedPolls).pipe(delay(500));
  }

  createPoll(pollData: CreatePollData): Observable<TransactionReceipt> {
    const newPoll: PollDetails = {
      id: this.mockPolls.length,
      creator: '0xCurrentUser',
      title: pollData.title,
      description: pollData.description,
      options: pollData.options.map((opt) => ({
        description: opt,
        voteCount: '0',
      })),
      deadline: new Date(
        new Date().getTime() + pollData.durationInDays * 24 * 60 * 60 * 1000
      ),
      active: true,
      totalVotePowerCast: '0',
      totalOptions: pollData.options.length,
    };
    this.mockPolls.push(newPoll);
    const receipt = {
        to: '0xMockContractAddress',
        from: '0xCurrentUser',
        contractAddress: '0xMockContractAddress',
        transactionIndex: 1,
        blockHash: '0xmockhash',
        transactionHash: '0xmocktxhash',
        blockNumber: 12345,
        logs: [],
        status: 1,
        logsBloom: "0x0",
        root: "0x0",
        gasUsed: BigInt(21000),
        cumulativeGasUsed: BigInt(21000),
        effectiveGasPrice: BigInt(1000000000),
        type: 0
    };
    return of(receipt as unknown as TransactionReceipt).pipe(delay(1000));
  }

  vote(pollId: number, optionId: number): Observable<TransactionReceipt> {
    const poll = this.mockPolls.find((p) => p.id === pollId);
    if (poll && poll.options[optionId]) {
      poll.options[optionId].voteCount = (
        parseInt(poll.options[optionId].voteCount, 10) + 100
      ).toString();
    }
    const receipt = {
        to: '0xMockContractAddress',
        from: '0xCurrentUser',
        contractAddress: '0xMockContractAddress',
        transactionIndex: 2,
        blockHash: '0xmockhash2',
        transactionHash: '0xmocktxhash2',
        blockNumber: 12346,
        logs: [],
        status: 1,
        logsBloom: "0x0",
        root: "0x0",
        gasUsed: BigInt(21000),
        cumulativeGasUsed: BigInt(42000),
        effectiveGasPrice: BigInt(1000000000),
        type: 0
    };
    return of(receipt as unknown as TransactionReceipt).pipe(delay(1000));
  }

  closePoll(pollId: number): Observable<TransactionReceipt> {
    const poll = this.mockPolls.find((p) => p.id === pollId);
    if (poll) {
      poll.active = false;
    }
    const receipt = {
        to: '0xMockContractAddress',
        from: '0xCurrentUser',
        contractAddress: '0xMockContractAddress',
        transactionIndex: 3,
        blockHash: '0xmockhash3',
        transactionHash: '0xmocktxhash3',
        blockNumber: 12347,
        logs: [],
        status: 1,
        logsBloom: "0x0",
        root: "0x0",
        gasUsed: BigInt(21000),
        cumulativeGasUsed: BigInt(63000),
        effectiveGasPrice: BigInt(1000000000),
        type: 0
    };
    return of(receipt as unknown as TransactionReceipt).pipe(delay(1000));
  }
}
