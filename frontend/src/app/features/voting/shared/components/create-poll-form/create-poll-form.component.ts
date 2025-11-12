import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components';
import { CreatePollData } from '../../../../../core/models/contract.model';

@Component({
  selector: 'app-create-poll-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  template: `
    <div class="create-form">
      <h2>Criar Nova Enquete</h2>

      <div class="create-form__info">
        <p><strong>Regras para criar uma enquete:</strong></p>
        <ul>
          <li>É necessário um saldo mínimo de <a href='https://goho-view.vercel.app/token' rel="noreferrer noopener nofollow" target='_blank'> <strong>1 GOHO</strong></a>.</li>
          <li>A duração deve ser entre 1 e 30 dias.</li>
          <li>A enquete deve ter de 2 a 10 opções.</li>
        </ul>
      </div>

      <form (ngSubmit)="onSubmit()" #createForm="ngForm">
        <label for="title">Título:</label>
        <input
          type="text"
          id="title"
          [(ngModel)]="formData.title"
          name="title"
          required
          class="form-control"
        />

        <div class="form-group">
          <label for="description">Descrição da Enquete:</label>
          <textarea
            id="description"
            [(ngModel)]="formData.description"
            name="description"
            required
            minlength="10"
            maxlength="500"
            placeholder="Descreva sua enquete..."
            class="form-control"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Opções de Voto:</label>
          @for (option of formData.options; track $index) {
          <div class="option-input">
            <input
              type="text"
              [(ngModel)]="formData.options[$index]"
              [name]="'option' + $index"
              required
              minlength="1"
              maxlength="100"
              placeholder="Opção {{ $index + 1 }}"
              class="form-control"
            />
            @if (formData.options.length > 2) {
            <app-button
              variant="danger"
              size="small"
              type="button"
              (clicked)="removeOption($index)"
              [disabled]="isCreating"
            >
              Remover
            </app-button>
            }
          </div>
          } @if (formData.options.length < 10) {
          <app-button
            variant="secondary"
            type="button"
            (clicked)="addOption()"
            [disabled]="isCreating"
          >
            Adicionar Opção
          </app-button>
          }
        </div>

        <div class="form-group">
          <label for="duration">Duração (dias):</label>
          <input
            type="number"
            id="duration"
            [(ngModel)]="formData.durationInDays"
            name="duration"
            required
            min="1"
            [max]="30"
            class="form-control"
          />
        </div>

        <div class="form-actions">
          <app-button
            type="submit"
            variant="primary"
            [disabled]="!createForm.valid || isCreating"
          >
            {{ isCreating ? 'Criando...' : 'Criar Enquete' }}
          </app-button>
          <app-button
            type="button"
            variant="secondary"
            (clicked)="onCancel()"
            [disabled]="isCreating"
          >
            Cancelar
          </app-button>
        </div>
      </form>
    </div>
  `,
  styleUrl: './create-poll-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePollFormComponent {
  @Input() isCreating = false;

  @Output() submit = new EventEmitter<CreatePollData>();
  @Output() cancel = new EventEmitter<void>();

  formData: CreatePollData = {
    title: '',
    description: '',
    options: ['', ''],
    durationInDays: 7,
  };

  addOption(): void {
    if (this.formData.options.length < 10) {
      this.formData.options.push('');
    }
  }

  removeOption(index: number): void {
    if (this.formData.options.length > 2) {
      this.formData.options.splice(index, 1);
    }
  }

  onSubmit(): void {
    const validOptions = this.formData.options.filter(
      (opt:any) => opt.trim().length > 0
    );
    if (validOptions.length < 2) {
      alert('É necessário pelo menos 2 opções válidas.');
      return;
    }

    if (this.formData.description.trim().length < 10) {
      alert('A descrição deve ter pelo menos 10 caracteres.');
      return;
    }

    const submitData: CreatePollData = {
      title: this.formData.title.trim(),
      description: this.formData.description.trim(),
      options: validOptions.map((opt:any) => opt.trim()),
      durationInDays: this.formData.durationInDays,
    };

    this.submit.emit(submitData);
  }

  onCancel(): void {
    this.resetForm();
    this.cancel.emit();
  }

  resetForm(): void {
    this.formData = {
      title: '',
      description: '',
      options: ['', ''],
      durationInDays: 7,
    };
  }
}
