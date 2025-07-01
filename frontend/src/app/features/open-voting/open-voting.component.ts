import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-open-voting',
  imports: [],
  template: `<p>open-voting works!</p>`,
  styleUrl: './open-voting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenVotingComponent {}
