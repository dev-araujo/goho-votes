import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { WalletService } from '../../core/services/wallet.service';
import { Network, NetworkService } from '../../core/services/network.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule, FormsModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private walletService = inject(WalletService);
  private networkService = inject(NetworkService);
  private cdr = inject(ChangeDetectorRef);

  @Input() isMenuOpen: boolean = false;
  @Output() menuClosed = new EventEmitter<void>();

  isConnected = this.walletService.isConnected;
  connectedAccount = this.walletService.connectedAccount;
  activeNetwork = this.networkService.activeNetwork;

  displayAddress = computed(() => {
    const account = this.connectedAccount();
    if (!account) return 'Conectar Carteira';

    return `${account.substring(0, 6)}...${account.substring(
      account.length - 4
    )}`;
  });

  closeMenu(): void {
    this.menuClosed.emit();
  }

  async handleWalletAction(): Promise<void> {
    if (this.isConnected()) {
      this.disconnect();
      return;
    }
    await this.connect();
  }

  private async connect(): Promise<void> {
    try {
      await this.walletService.connectWallet();
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Falha ao conectar carteira a partir do navbar:', error);
    } finally {
      this.closeMenu();
    }
  }

  private disconnect(): void {
    this.walletService.disconnectWallet();
    console.log('Carteira desconectada.');
    this.cdr.markForCheck();
    this.closeMenu();
  }

  onNetworkChange(event: Event): void {
    const selectElement = event?.target as HTMLSelectElement;
    this.networkService.setNetwork(selectElement?.value as Network);
  }
}
