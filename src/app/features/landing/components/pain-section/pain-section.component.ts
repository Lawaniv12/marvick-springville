import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pain-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pain-section.component.html',
  styleUrls: ['./pain-section.component.scss'],
})
export class PainSectionComponent {
  pains = [
    { icon: '📵', title: 'Clients Can\'t Find You', desc: 'Customers search for what you sell, can\'t locate you, and buy from your competitor. You\'ll never know they existed.' },
    { icon: '📋', title: 'No Product Catalogue', desc: 'Customers want to browse, compare, and order — but without a proper platform, they give up. Lost sale, every time.' },
    { icon: '🌍', title: 'Your Reach Is Limited', desc: 'Your business is in Kano but customers are in Lagos, Abuja, Port Harcourt. Without a platform, they simply can\'t order.' },
    { icon: '📉', title: 'Zero Customer Data', desc: 'If Instagram went down tomorrow, your entire audience disappears. No memory. No repeat customers. No loyalty engine.' },
    { icon: '🕐', title: 'Bookings Eat Your Time', desc: 'You\'re managing orders manually, answering the same questions over and over — time that should go into growing your business.' },
    { icon: '🏆', title: 'Competitors Are Ahead', desc: 'Your direct competitors already have websites. They look more professional, more trustworthy — and they close deals you could have had.' },
  ];
}
