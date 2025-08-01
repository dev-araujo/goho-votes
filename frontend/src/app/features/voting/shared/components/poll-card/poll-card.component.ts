import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { PollDetails } from '../../../../../core/models/contract.model';
import { ButtonComponent } from '../../../../../shared/components';

@Component({
  selector: 'app-poll-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent, DecimalPipe],
  template: `
    <div class="poll-card-content">
      <div class="poll-details-grid">
        <div class="poll-details-grid__left">
          <h4>Descrição</h4>
          <p class="poll-description">{{ poll.description }}</p>

          <div class="poll-meta">
            <div class="poll-meta__item">
              <span class="poll-meta__label">Criador</span>
              <span
                class="poll-meta__value creator-address"
                [title]="poll.creator"
                >{{ poll.creator }}</span
              >
            </div>
            <div class="poll-meta__item">
              <span class="poll-meta__label">Poder de Voto Total</span>
              <span class="poll-meta__value">{{ poll.totalVotePowerCast | number: '1.0-0' }} GOHO</span>
            </div>
            <div class="poll-meta__item">
              <span class="poll-meta__label">Opções</span>
              <span class="poll-meta__value">{{ poll.totalOptions | number: '1.0-0' }}</span>
            </div>
          </div>
        </div>

        <div class="poll-details-grid__right">
          <h4>Opções de Voto</h4>
          <div class="poll-card__options">
            @for (option of poll.options; track $index) {
            <div class="poll-option" [class.has-voted]="hasUserVoted">
              <div class="poll-option__details">
                <span class="poll-option__description">{{ option.description }}</span>
                <div class="poll-option__vote-info">
                  <span class="poll-option__percentage">{{ getVotePercentage(option.voteCount, poll.totalVotePowerCast) | number: '1.0-0' }}%</span>
                  <span class="poll-option__votes">{{ option.voteCount | number: '1.0-0' }} GOHO</span>
                </div>
              </div>
              <div class="poll-option__bar">
                <div class="poll-option__progress" [style.width.%]="getVotePercentage(option.voteCount, poll.totalVotePowerCast)"></div>
              </div>
              @if (canVote && !hasUserVoted) {
              <div class="poll-option__action">
                <app-button
                  variant="vote"
                  size="small"
                  (clicked)="onVote($index)"
                  [disabled]="isVoting"
                >
                  Votar
                </app-button>
              </div>
              }
            </div>
            }
          </div>
        </div>
      </div>

      <div class="poll-card__footer">
        @if (hasUserVoted) {
        <span class="voted-badge">✓ Você já votou</span>
        } @else if (canVote) {
        <span class="wallet-required">Conecte sua carteira para votar</span>
        } @else if (canVote && !hasUserVoted) {
          <span class="wallet-required">Seu poder de voto é igual ao seu saldo de GOHO. Mínimo de 1 GOHO para votar.</span>
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
}
