import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractService } from '../../../core/services/contract.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PollDetails } from '../../../core/models/contract.model';
import { LoadingComponent, ErrorComponent, EmptyStateComponent } from '../../../shared/components';
import { PollsGridComponent } from '../shared';

@Component({
  selector: 'app-closed-voting',
  standalone: true,
  imports: [
    CommonModule,
    LoadingComponent,
    ErrorComponent,
    EmptyStateComponent,
    PollsGridComponent,
  ],
  template: `
    <section class="closed-voting">
      <header class="closed-voting__header">
        <h1>Enquetes Encerradas</h1>
      </header>

      @if (isLoading()) {
        <app-loading message="Carregando enquetes encerradas..."></app-loading>
      } @if (error()) {
        <app-error [message]="error()!" (retry)="loadPolls()"></app-error>
      } @if (!isLoading() && !error() && closedPolls().length === 0) {
        <app-empty-state
          title="Nenhuma enquete encerrada"
          description="Ainda não há enquetes encerradas para exibir."
          icon="🗳️"
        ></app-empty-state>
      } @if (!isLoading() && !error() && closedPolls().length > 0) {
        <app-polls-grid [polls]="closedPolls()"></app-polls-grid>
      }
    </section>
  `,
  styleUrl: './closed-voting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClosedVotingComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);
  private _contractService = inject(ContractService);

  closedPolls = signal<PollDetails[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadPolls();
  }

  loadPolls() {
    this.isLoading.set(true);
    this.error.set(null);

    this._contractService
      .getClosedPolls()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (polls) => {
          this.closedPolls.set(polls);
        },
        error: (err) => {
          console.error('Erro ao carregar enquetes encerradas:', err);
          this.error.set('Erro ao carregar enquetes encerradas. Tente novamente.');
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }
}