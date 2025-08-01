import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PollDetails } from '../../../../../core/models/contract.model';
import { PollCardComponent } from '../poll-card/poll-card.component';

@Component({
  selector: 'app-polls-accordion',
  standalone: true,
  imports: [CommonModule, PollCardComponent],
  template: `
    <div class="polls-accordion">
      @for (poll of polls; track poll.id) {
        <details class="accordion-item" [attr.data-poll-id]="poll.id">
          <summary class="accordion-header">
            <span class="accordion-title">{{ poll.title }}</span>
            <span class="accordion-meta">
              <span class="poll-id">ID: {{ poll.id }}</span>
              <span class="poll-deadline">
                {{ poll.deadline ? ('Termina em: ' + formatDeadline(poll.deadline)) : 'Encerrada' }}
              </span>
            </span>
          </summary>
          <div class="accordion-content">
            <app-poll-card
              [poll]="poll"
              [canVote]="canVote"
              [hasUserVoted]="hasUserVoted(poll.id)"
              [isVoting]="isVoting"
              (vote)="onVote(poll.id, $event)"
            ></app-poll-card>
          </div>
        </details>
      }
    </div>
  `,
  styleUrl: './polls-accordion.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PollsAccordionComponent {
  @Input() polls: PollDetails[] = [];
  @Input() canVote = false;
  @Input() isVoting = false;
  @Input() userVotedPolls: Set<number> = new Set();

  @Output() vote = new EventEmitter<{ pollId: number; optionIndex: number }>();

  hasUserVoted(pollId: number): boolean {
    return this.userVotedPolls.has(pollId);
  }

  onVote(pollId: number, optionIndex: number): void {
    this.vote.emit({ pollId, optionIndex });
  }

  formatDeadline(deadline: Date): string {
    if (!deadline || !(deadline instanceof Date) || isNaN(deadline.getTime())) {
      return 'Data inválida';
    }
    
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    
    if (diff < 0) {
      return 'Encerrada';
    }

    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Hoje';
    if (days === 1) return 'Amanhã';
    return `em ${days} dias`;
  }
}
