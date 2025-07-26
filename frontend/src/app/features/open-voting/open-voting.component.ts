import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { ContractService } from '../../core/services/contract.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PollDetails } from '../../core/models/contract.model';

@Component({
  selector: 'app-open-voting',
  imports: [],
  template: `<section>
    @if(openedPolls)
      { @for(pool of openedPolls; track pool.id){
    <h1>{{ pool['description'] }}</h1>
    } }@else {
     <button>Crie uma votação</button>
    }
  </section>`,
  styleUrl: './open-voting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpenVotingComponent {
  openedPolls!: PollDetails[];
  load = false;
  private _destroyRef = inject(DestroyRef);
  private _service = inject(ContractService);

  ngOnInit() {
    this.getPolls();
  }

  getPolls() {
    this._service
      .getRulesPolls()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (pools: any) => {
          this.load = true;
          this.openedPolls = pools;
          console.log(pools);
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
