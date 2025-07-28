import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PollDetails } from '../../../../core/models/contract.model';
import { PollCardComponent } from '../poll-card/poll-card.component';


@Component({
  selector: 'app-polls-grid',
  standalone: true,
  imports: [CommonModule, PollCardComponent],
  template: `
    <div class="polls-grid">
      @for (poll of polls; track poll.id) {
        <app-poll-card
          [poll]="poll"
          [canVote]="canVote"
          [hasUserVoted]="hasUserVoted(poll.id)"
          [isVoting]="isVoting"
          (vote)="onVote(poll.id, $event)"
        ></app-poll-card>
      }
    </div>
  `,
  styleUrl: './polls-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PollsGridComponent {
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
}
