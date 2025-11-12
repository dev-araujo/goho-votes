import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

const COMPONENTS = [SidebarComponent];
const CORE = [RouterOutlet, CommonModule];

@Component({
  selector: 'app-layout',
  imports: [...COMPONENTS, ...CORE],
  template: `
    <div class="layout">
  <app-sidebar
    [class.is-open]="isMenuOpen()"
    [isMenuOpen]="isMenuOpen()"
    (menuClosed)="closeMenu()"
  />
  <button
    class="menu-toggle"
    (click)="toggleMenu()"
    aria-label="Toggle menu"
  >
    <span class="material-icons">{{
      isMenuOpen() ? "close" : "menu"
    }}</span>
  </button>
  <main class="layout__content">
    <router-outlet />
  </main>
</div>
  `,
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  isMenuOpen = signal(false);

  toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }
}