import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { PollDetails } from '../../../../core/models/contract.model';
import { ButtonComponent } from '../../../../shared/components';

@Component({
  selector: 'app-poll-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent, DecimalPipe],
  template: `
    <div class="poll-card">
      <div class="poll-card__header">
        <div class="poll-card__meta">
            <span class="poll-id">ID: {{ poll.id }}</span>
            <span class="poll-deadline">
              Termina em: {{ formatDeadline(poll.deadline) }}
            </span>
          </div>
        <h3>{{ poll.title }}</h3>
        <details>
          
          <summary>Detalhes</summary>
          <p>{{ poll.description }}</p>
        </details>
      </div>

      <div class="poll-card__options">
        @for (option of poll.options; track $index) {
        <div class="poll-option">
          <div class="poll-option__info">
            <span class="poll-option__description">{{
              option.description
            }}</span>
            <span class="poll-option__votes">{{ option.voteCount | number:'1.0-0' }} votos</span>
          </div>
          <div class="poll-option__bar">
            <div
              class="poll-option__progress"
              [style.width.%]="
                getVotePercentage(option.voteCount, poll.totalVotePowerCast)
              "
            ></div>
          </div>
          @if (canVote && !hasUserVoted) {
          <app-button
            variant="vote"
            size="small"
            (clicked)="onVote($index)"
          >
            Votar
          </app-button>
          }
        </div>
        }
      </div>

      <div class="poll-card__footer">
        <div class="poll-stats">
          <span>Total de votos: {{ poll.totalVotePowerCast | number:'1.0-0' }}</span>
          <span>Opções: {{ poll.totalOptions | number:'1.0-0' }}</span>
        </div>
        @if (hasUserVoted) {
        <span class="voted-badge">✓ Você já votou</span>
        } @if (!canVote && !hasUserVoted) {
        <span class="wallet-required">Conecte sua carteira para votar</span>
        }
      </div>
    </div>
  `,
  styleUrl: './poll-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PollCardComponent {
  @Input() poll!: PollDetails;
  @Input() canVote = false;
  @Input() hasUserVoted = false;
  @Input() isVoting = false;

  @Output() vote = new EventEmitter<number>();

  onVote(optionIndex: number): void {
    this.vote.emit(optionIndex);
  }

  getVotePercentage(voteCount: string, totalVotes: string): number {
    const votes = parseFloat(voteCount);
    const total = parseFloat(totalVotes);
    return total > 0 ? (votes / total) * 100 : 0;
  }

  formatDeadline(deadline: Date): string {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return 'Expirada';
    if (days === 0) return 'Hoje';
    if (days === 1) return '1 dia';
    return `${days} dias`;
  }
}
