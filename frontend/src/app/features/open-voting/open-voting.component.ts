import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { ContractService } from '../../core/services/contract.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-open-voting',
  imports: [],
  template: `<p>open-voting works!</p>`,
  styleUrl: './open-voting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenVotingComponent {
  openedPolls = [];
  load = false;
  private _destroyRef = inject(DestroyRef);
  private _service = inject(ContractService);

  ngOnInit() {
    this.getPolls();
  }

  getPolls() {
    this._service
      .getOpenPolls()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (pools: any) => {
          this.load = true;
          this.openedPolls = pools;
        },
        error: (err) => {
          console.error('Ocorreu um erro: ', err);
        },
        complete: () => {
          this.load = false;
        },
      });
  }
}
