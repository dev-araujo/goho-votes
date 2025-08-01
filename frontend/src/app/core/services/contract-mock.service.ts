import { Injectable } from '@angular/core';
import { Observable, of, delay, tap, map } from 'rxjs';
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
  private mockPolls: PollDetails[] = [];
  private votedPolls = new Set<number>([1]); 

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    const now = new Date().getTime();
    this.mockPolls = [
      {
        id: 0,
        creator: '0xDAOCommitteeAddress',
        title: 'Financiar o Desenvolvimento do Módulo de Análise de Votos',
        description: 'Proposta para alocar 50.000 GOHO da tesouraria para financiar uma equipe externa para desenvolver um dashboard avançado de análise de votos e governança.',
        options: [
          { description: 'Aprovar Financiamento', voteCount: '12' },
          { description: 'Rejeitar Financiamento', voteCount: '3' },
          { description: 'Abster-se', voteCount: '5' },
        ],
        deadline: new Date(now + 10 * 24 * 60 * 60 * 1000), 
        active: true,
        totalVotePowerCast: '20',
        totalOptions: 3,
      },
      {
        id: 1,
        creator: '0xCommunityLeadAddress',
        title: 'Parceria Estratégica com o Protocolo HorseChain',
        description: 'Votação para formalizar uma parceria com a HorseChain, integrando seus oráculos de preços de ração para cavalos em nosso ecossistema.',
        options: [
          { description: 'Sim, aprovar parceria', voteCount: '3' },
          { description: 'Não, manter independência', voteCount: '12' },
        ],
        deadline: new Date(now - 2 * 24 * 60 * 60 * 1000), 
        active: false,
        totalVotePowerCast: '15',
        totalOptions: 2,
      },
      {
        id: 2,
        creator: '0xDevTeamAddress',
        title: 'Reduzir a Duração Máxima das Enquetes de 30 para 15 dias',
        description: 'Proposta técnica para alterar a constante MAX_POLL_DURATION no smart contract para agilizar a tomada de decisões da DAO.',
        options: [
          { description: 'A favor da redução para 15 dias', voteCount: '7' },
          { description: 'Manter os 30 dias atuais', voteCount: '8' },
        ],
        deadline: new Date(now + 5 * 24 * 60 * 60 * 1000), 
        active: true,
        totalVotePowerCast: '15',
        totalOptions: 2,
      },
      {
        id: 3,
        creator: '0xMarketingTeamAddress',
        title: 'Qual deve ser o tema do nosso próximo Hackathon?',
        description: 'A equipe de marketing precisa da ajuda da comunidade para decidir o foco do hackathon do próximo trimestre para maximizar o engajamento.',
        options: [
          { description: 'Ferramentas para DAOs', voteCount: '12' },
          { description: 'Gamificação e NFTs', voteCount: '9' },
          { description: 'Integrações DeFi', voteCount: '9' },
        ],
        deadline: new Date(now - 10 * 24 * 60 * 60 * 1000), 
        active: false,
        totalVotePowerCast: '30',
        totalOptions: 3,
      },
    ];
  }

  getRulesPolls(): Observable<ContractConstants> {
    const mockConstants: ContractConstants = {
      minimumGohoToCreatePoll: '1000',
      minimumGohoToVote: '1',
      maxPollDurationInDays: 30,
    };
    return of(mockConstants).pipe(delay(300));
  }

  getPollCount(): Observable<number> {
    return of(this.mockPolls.length).pipe(delay(300));
  }

  getPollDetails(
    pollId: number,
    offset: number,
    limit: number
  ): Observable<PollDetails> {
    const poll = this.mockPolls.find((p) => p.id === pollId);
    return of(poll as PollDetails).pipe(delay(300));
  }

  hasVoted(pollId: number, address: string): Observable<boolean> {
    return of(this.votedPolls.has(pollId)).pipe(delay(100));
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
      creator: '0xCurrentUserAddress',
      title: pollData.title,
      description: pollData.description,
      options: pollData.options.map((opt) => ({ description: opt, voteCount: '0' })),
      deadline: new Date(new Date().getTime() + pollData.durationInDays * 24 * 60 * 60 * 1000),
      active: true,
      totalVotePowerCast: '0',
      totalOptions: pollData.options.length,
    };
    this.mockPolls.push(newPoll);
    const receipt: Partial<TransactionReceipt> = { status: 1, blockNumber: 12345, hash: '0xmocktxhash_create' };
    return of(receipt as TransactionReceipt).pipe(delay(1000));
  }

  vote(pollId: number, optionId: number): Observable<TransactionReceipt> {
    return of(null).pipe(
      delay(1000),
      tap(() => {
        const poll = this.mockPolls.find((p) => p.id === pollId);
        if (poll && poll.options[optionId] && !this.votedPolls.has(pollId)) {
          const mockVotePower = Math.floor(Math.random() * 5000) + 100; 
          
          const currentVotes = BigInt(poll.options[optionId].voteCount);
          poll.options[optionId].voteCount = (currentVotes + BigInt(mockVotePower)).toString();

          const totalPower = BigInt(poll.totalVotePowerCast);
          poll.totalVotePowerCast = (totalPower + BigInt(mockVotePower)).toString();

          this.votedPolls.add(pollId);
        }
      }),
      map(() => {
        const receipt: Partial<TransactionReceipt> = { status: 1, blockNumber: 12346, hash: '0xmocktxhash_vote' };
        return receipt as TransactionReceipt;
      })
    );
  }

  closePoll(pollId: number): Observable<TransactionReceipt> {
    const poll = this.mockPolls.find((p) => p.id === pollId);
    if (poll) {
      poll.active = false;
    }
    const receipt: Partial<TransactionReceipt> = { status: 1, blockNumber: 12347, hash: '0xmocktxhash_close' };
    return of(receipt as TransactionReceipt).pipe(delay(1000));
  }
}