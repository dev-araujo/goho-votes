import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-closed-voting',
  imports: [],
  template: `<p>closed-voting works!</p>`,
  styleUrl: './closed-voting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClosedVotingComponent {}
