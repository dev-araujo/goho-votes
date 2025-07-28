import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="error">
      <div class="error__icon">⚠️</div>
      <p class="error__message">{{ message }}</p>
      @if (showRetry) {
        <app-button 
          variant="secondary" 
          (clicked)="onRetry()"
        >
          {{ retryText }}
        </app-button>
      }
    </div>
  `,
  styleUrl: './error.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorComponent {
  @Input() message = 'Ocorreu um erro inesperado.';
  @Input() showRetry = true;
  @Input() retryText = 'Tentar Novamente';

  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
