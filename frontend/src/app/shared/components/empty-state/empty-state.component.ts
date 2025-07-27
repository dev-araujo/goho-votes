import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state">
      @if (icon) {
        <div class="empty-state__icon">{{ icon }}</div>
      }
      <h2 class="empty-state__title">{{ title }}</h2>
      @if (description) {
        <p class="empty-state__description">{{ description }}</p>
      }
      @if (hint) {
        <p class="empty-state__hint">{{ hint }}</p>
      }
      <ng-content></ng-content>
    </div>
  `,
  styleUrl: './empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyStateComponent {
  @Input() title = '';
  @Input() description?: string;
  @Input() hint?: string;
  @Input() icon?: string;
}
