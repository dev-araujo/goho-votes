import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonSize, ButtonVariant } from '../../models/shared.model';


@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [class]="buttonClasses"
      (click)="handleClick()"
    >
     
      <ng-content></ng-content>
    </button>
  `,
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'medium';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() fullWidth = false;

  @Output() clicked = new EventEmitter<void>();

  get buttonClasses(): string {
    const classes = ['btn'];
    classes.push(`btn--${this.variant}`);
    classes.push(`btn--${this.size}`);
    
    if (this.fullWidth) {
      classes.push('btn--full-width');
    }
    
    return classes.join(' ');
  }

  handleClick(): void {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }
}
