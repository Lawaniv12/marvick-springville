import { Component } from '@angular/core';
import { WhatsAppService } from '../../../../core/services/whatsapp.service';

@Component({
  selector: 'app-final-cta',
  standalone: true, imports: [],
  templateUrl: './final-cta.component.html',
  styleUrls: ['./final-cta.component.scss'],
})
export class FinalCtaComponent {
  constructor(private wa: WhatsAppService) {}
  open() { this.wa.openChat(); }
}
