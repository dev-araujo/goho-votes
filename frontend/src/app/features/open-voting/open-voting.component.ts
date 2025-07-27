import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../core/services/contract.service';
import { WalletService } from '../../core/services/wallet.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  PollDetails,
  ContractConstants,
  CreatePollData,
} from '../../core/models/contract.model';
import { forkJoin } from 'rxjs';

import {
  ButtonComponent,
  LoadingComponent,
  ErrorComponent,
  EmptyStateComponent,
} from '../../shared/components';

import { CreatePollFormComponent, PollsGridComponent } from '.';

@Component({
  selector: 'app-open-voting',
  imports: [
    CommonModule,
    ButtonComponent,
    LoadingComponent,
    ErrorComponent,
    EmptyStateComponent,
    CreatePollFormComponent,
    PollsGridComponent,
  ],
  template: `
    <section class="open-voting">
      <header class="open-voting__header">
        <h1>Enquetes Abertas</h1>
        @if (isConnected()) {
        <app-button
          variant="primary"
          (clicked)="toggleCreateForm()"
          [disabled]="isLoading()"
        >
          {{ showCreateForm() ? 'Cancelar' : 'Criar Enquete' }}
        </app-button>
        }
      </header>

      @if (showCreateForm()) {
      <app-create-poll-form
        [isCreating]="isCreating()"
        (submit)="onCreatePoll($event)"
        (cancel)="onCancelCreateForm()"
      ></app-create-poll-form>
      } @if (isLoading()) {
      <app-loading message="Carregando enquetes..."></app-loading>
      } @if (error()) {
      <app-error [message]="error()!" (retry)="loadPolls()"></app-error>
      } @if (!isLoading() && !error() && openedPolls().length === 0 ) {
      @if(!showCreateForm()){
      <app-empty-state
        title="Nenhuma enquete aberta"
        description="Seja o primeiro a criar uma enquete!"
        [hint]="
          !isConnected()
            ? 'Conecte sua carteira para criar enquetes.'
            : undefined
        "
        icon="🗳️"
      ></app-empty-state>
      } } @if (!isLoading() && !error() && openedPolls().length > 0) {
      <app-polls-grid
        [polls]="openedPolls()"
        [canVote]="isConnected()"
        [isVoting]="isVoting()"
        [userVotedPolls]="userVotedPolls()"
        (vote)="onVote($event)"
      ></app-polls-grid>
      }
    </section>
  `,
  styleUrl: './open-voting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenVotingComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _contractService = inject(ContractService);
  private _walletService = inject(WalletService);

  openedPolls = signal<PollDetails[]>([]);
  isLoading = signal<boolean>(false);
  isVoting = signal<boolean>(false);
  isCreating = signal<boolean>(false);
  error = signal<string | null>(null);
  showCreateForm = signal<boolean>(false);
  contractRules = signal<ContractConstants | null>(null);
  userVotedPolls = signal<Set<number>>(new Set());

  isConnected = this._walletService.isConnected;
  connectedAccount = this._walletService.connectedAccount;

  ngOnInit() {
    this.loadPolls();
  }

  loadPolls() {
    this.isLoading.set(true);
    this.error.set(null);

    this._contractService
      .getOpenPolls()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (polls) => {
          this.openedPolls.set(polls);
          this.checkUserVotes(polls);
          console.log('Enquetes abertas:', polls);
        },
        error: (err) => {
          console.error('Erro ao carregar enquetes:', err);
          this.error.set('Erro ao carregar enquetes. Tente novamente.');
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  checkUserVotes(polls: PollDetails[]) {
    const account = this.connectedAccount();
    if (!account || polls.length === 0) return;

    const voteChecks = polls.map((poll) =>
      this._contractService.hasVoted(poll.id, account)
    );

    forkJoin(voteChecks)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (results) => {
          const votedPollIds = new Set<number>();
          results.forEach((hasVoted, index) => {
            if (hasVoted) {
              votedPollIds.add(polls[index].id);
            }
          });
          this.userVotedPolls.set(votedPollIds);
        },
        error: (err) => {
          console.error('Erro ao verificar votos do usuário:', err);
        },
      });
  }

  toggleCreateForm() {
    this.showCreateForm.set(!this.showCreateForm());
  }

  onCancelCreateForm() {
    this.showCreateForm.set(false);
  }

  onCreatePoll(pollData: CreatePollData) {
    if (!this.isConnected()) {
      alert('Conecte sua carteira para criar enquetes.');
      return;
    }

    this.isCreating.set(true);

    this._contractService
      .createPoll(pollData)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (receipt) => {
          console.log('Enquete criada:', receipt);
          this.showCreateForm.set(false);
          this.loadPolls();
        },
        error: (err) => {
          console.error('Erro ao criar enquete:', err);
          alert(
            'Erro ao criar enquete. Verifique se você tem GOHO suficiente.'
          );
        },
        complete: () => {
          this.isCreating.set(false);
        },
      });
  }

  onVote(event: { pollId: number; optionIndex: number }) {
    if (!this.isConnected()) {
      alert('Conecte sua carteira para votar.');
      return;
    }

    this.isVoting.set(true);

    this._contractService
      .vote(event.pollId, event.optionIndex)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (receipt) => {
          console.log('Voto registrado:', receipt);
          const voted = new Set(this.userVotedPolls());
          voted.add(event.pollId);
          this.userVotedPolls.set(voted);
          this.loadPolls();
        },
        error: (err) => {
          console.error('Erro ao votar:', err);
          alert('Erro ao registrar voto. Tente novamente.');
        },
        complete: () => {
          this.isVoting.set(false);
        },
      });
  }
}
