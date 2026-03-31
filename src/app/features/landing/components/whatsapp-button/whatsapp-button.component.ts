import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatsAppService } from '../../../../core/services/whatsapp.service';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whatsapp-button.component.html',
  styleUrls: ['./whatsapp-button.component.scss'],
})
export class WhatsappButtonComponent {
  visible = signal(false);
  constructor(private wa: WhatsAppService) {}

  @HostListener('window:scroll')
  onScroll() { this.visible.set(window.scrollY > window.innerHeight * 0.8); }

  open() { this.wa.openChat(); }
}
