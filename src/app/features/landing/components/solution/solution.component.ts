import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solution',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solution.component.html',
  styleUrls: ['./solution.component.scss'],
})
export class SolutionComponent {
  features = [
    { num: '01', title: 'Full Online Storefront', desc: 'A professionally designed website showcasing your entire product catalogue. Customers browse, select, and order — anytime, from anywhere in Nigeria.' },
    { num: '02', title: 'Booking & Order System', desc: 'Automated bookings and order management. No more manual DMs. No more missed orders at 2am. Your platform handles it all in real time.' },
    { num: '03', title: 'Customer Database', desc: 'Every customer who visits your site becomes a contact you own. Run promotions, build loyalty, reach them directly — social media or not.' },
    { num: '04', title: 'Nigeria-Wide Reach', desc: 'Customers in Lagos, Abuja, Kaduna, Port Harcourt and beyond can discover your business, see your products, and order for delivery.' },
    { num: '05', title: 'Mobile-Optimised', desc: 'Over 80% of Nigerians browse on mobile. Your platform works flawlessly on every screen — fast, clean, and professional.' },
    { num: '06', title: 'Ongoing Support', desc: 'We don\'t disappear after launch. Updates, edits, technical help — we\'re your digital partner for the long run.' },
  ];
}
