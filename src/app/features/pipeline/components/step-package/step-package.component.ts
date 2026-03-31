import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipelineService, DEPOSIT_PERCENT, LeadInfo } from '../../../../core/services/pipeline.service';
import { Package } from '../../../landing/components/offer/offer.component';

@Component({
  selector: 'app-step-package',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-package.component.html',
  styleUrls: ['./step-package.component.scss'],
})
export class StepPackageComponent implements OnInit {
  // inject() MUST come before any field that references it
  readonly pipeline = inject(PipelineService);

  readonly lead = this.pipeline.leadInfo;
  readonly selectedPkg = this.pipeline.selectedPackage;
  readonly deposit = DEPOSIT_PERCENT;
  recommendedPkg = signal<Package | null>(null);

  readonly allPackages: Package[] = [
    { id: 'landing', name: 'Landing Page', tagline: 'Get found. Get calls.', price: '₦65,000', was: '₦100,000', deliveryDays: '3 days', highlight: false,  idealFor: 'Freelancers, coaches, service providers', features: ['Single professional page', 'Your services & contact info', 'WhatsApp integration', 'Mobile optimised', '1 month support'], cta: 'Select' },
    { id: 'funnel', name: 'Sales Funnel', tagline: 'Turn visitors into buyers.', price: '₦110,000', was: '₦180,000', deliveryDays: '5 days', highlight: false, idealFor: 'Course sellers, consultants, product launchers', features: ['3–5 page funnel', 'Lead capture form', 'Countdown timer', 'WhatsApp follow-up', '2 months support'], cta: 'Select' },
    { id: 'website', name: 'Complete Website', tagline: 'Your full business online.', price: '₦149,000', was: '₦250,000', deliveryDays: '7 days', highlight: true,  idealFor: 'SMEs, food, fashion, logistics, healthcare', features: ['5–8 page custom website', 'Booking & order system', 'Customer database', 'Blog section', '3 months support'], badge: '🔥 Most Popular', cta: 'Select' },
    { id: 'ecommerce', name: 'E-Commerce Store', tagline: 'Sell to all of Nigeria.', price: '₦280,000', was: '₦450,000', deliveryDays: '10 days', highlight: false,  idealFor: 'Retailers, fashion brands, food/drinks sellers', features: ['Full online store', 'Paystack/Flutterwave integration', 'Order management', 'Inventory tracking', '6 months support'], cta: 'Select' },
    { id: 'webapp', name: 'Web Application', tagline: 'Custom tools for your business.', price: '₦500,000', was: undefined, deliveryDays: '3–4 weeks', highlight: false,  idealFor: 'Businesses needing custom portals or dashboards', features: ['Custom Angular/React app', 'User authentication', 'Admin dashboard', 'API + database', '6 months support'], cta: 'Select' },
    { id: 'mobileapp', name: 'Mobile Application', tagline: 'Your business in every pocket.', price: '₦850,000', was: undefined, deliveryDays: '6–8 weeks', highlight: false,  idealFor: 'Scaling businesses, delivery platforms', features: ['iOS + Android', 'Push notifications', 'Paystack integration', 'App Store submission', '12 months support'], cta: 'Select' },
  ];

  ngOnInit() {
    const lead = this.lead();
    const wanted = lead?.serviceWanted?.toLowerCase() ?? '';
    const budget = lead?.budgetRange ?? '';

    let match = this.allPackages.find(p =>
      p.name.toLowerCase().includes(wanted) ||
      wanted.includes(p.name.toLowerCase().split(' ')[0])
    );

    if (!match) {
      if (budget.includes('Under ₦100')) match = this.allPackages[0];
      else if (budget.includes('100,000 – ₦200')) match = this.allPackages[2];
      else if (budget.includes('200,000 – ₦400')) match = this.allPackages[3];
      else if (budget.includes('400,000')) match = this.allPackages[4];
      else if (budget.includes('Above')) match = this.allPackages[5];
      else match = this.allPackages[2];
    }

    this.recommendedPkg.set(match ?? this.allPackages[2]);
    if (!this.selectedPkg()) {
      this.pipeline.setPackage(match ?? this.allPackages[2]);
    }
  }

  select(pkg: Package) { this.pipeline.setPackage(pkg); }
  isSelected(pkg: Package) { return this.selectedPkg()?.id === pkg.id; }
  proceed() { this.pipeline.setStep('payment'); }
  back() { this.pipeline.setStep('info'); }

  // Safe getters for template — avoids optional chaining warnings
  get firstName(): string { return this.lead()?.fullName?.split(' ')[0] ?? ''; }
  get firstInitial(): string { return this.lead()?.fullName?.[0] ?? '?'; }
  get serviceWanted(): string { return this.lead()?.serviceWanted ?? ''; }
  get budgetRange(): string { return this.lead()?.budgetRange ?? ''; }
}
