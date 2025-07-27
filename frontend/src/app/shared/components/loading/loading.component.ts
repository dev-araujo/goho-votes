import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading" [class.loading--inline]="inline">
      <div class="loading__spinner" [class.loading__spinner--small]="size === 'small'"></div>
      @if (message) {
        <p class="loading__message">{{ message }}</p>
      }
    </div>
  `,
  styleUrl: './loading.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  @Input() message?: string;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() inline = false;
}
