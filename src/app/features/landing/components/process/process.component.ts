import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss'],
})
export class ProcessComponent {
  steps = [
    { num: '01', title: 'You Contact Us', desc: 'Reach out via WhatsApp or the form below. We have a quick 30-minute call to understand your business, your products, and what you want to achieve.', tag: 'Free Consultation', icon: '💬' },
    { num: '02', title: 'We Design Your Platform', desc: 'Our team creates a bespoke design that represents your brand — not a template. You see a preview and approve every detail before anything goes live.', tag: '2–3 Days', icon: '🎨' },
    { num: '03', title: 'We Build & Configure', desc: 'We load your products, set up the booking and order system, connect payment options, and make sure every link and button works perfectly.', tag: '3–4 Days', icon: '⚙️' },
    { num: '04', title: 'You Go Live & Start Earning', desc: 'Your website goes live, we hand over full control and walk you through everything. From day one, your business is open to all of Nigeria.', tag: 'Day 7', icon: '🚀' },
  ];
}
