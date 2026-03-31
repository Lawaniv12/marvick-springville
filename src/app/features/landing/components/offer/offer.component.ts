import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatsAppService } from '../../../../core/services/whatsapp.service';

export interface Package {
  id: string;
  name: string;
  tagline: string;
  price: string;
  was?: string;
  deliveryDays: string;
  highlight: boolean;
  badge?: string;
  // icon: string;
  features: string[];
  cta: string;
  idealFor: string;
}

@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offer.component.html',
  styleUrls: ['./offer.component.scss'],
})
export class OfferComponent implements OnInit, OnDestroy {
  days = signal('--'); hours = signal('--'); mins = signal('--'); secs = signal('--');
  private timer?: ReturnType<typeof setInterval>;
  private end = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  activeCategory = signal<'web' | 'app'>('web');

  webPackages: Package[] = [
    {
      id: 'landing',
      name: 'Landing Page',
      tagline: 'Get found. Get calls.',
      price: '₦65,000',
      was: '₦100,000',
      deliveryDays: '3 days',
      highlight: false,
      // icon: '🎯',
      idealFor: 'Freelancers, service providers, speakers, coaches',
      features: [
        'Single professionally designed page',
        'Your story, services & contact info',
        'WhatsApp & social media links',
        'Mobile optimised',
        'Google-ready (basic SEO)',
        '1 month free support',
      ],
      cta: 'Get Landing Page',
    },
    {
      id: 'funnel',
      name: 'Sales Funnel',
      tagline: 'Turn visitors into buyers.',
      price: '₦115,000',
      was: '₦180,000',
      deliveryDays: '5 days',
      highlight: false,
      // icon: '📈',
      idealFor: 'Course sellers, consultants, product launchers',
      features: [
        'Multi-step sales funnel (3–5 pages)',
        'Persuasive copywriting structure',
        'Lead capture & email list builder',
        'Offer/promo countdown timer',
        'WhatsApp follow-up integration',
        '2 months free support',
      ],
      cta: 'Get Sales Funnel',
    },
    {
      id: 'website',
      name: 'Complete Website',
      tagline: 'Your full business online.',
      price: '₦149,000',
      was: '₦250,000',
      deliveryDays: '7 days',
      highlight: true,
      badge: '🔥 Most Popular',
      // icon: '🌐',
      idealFor: 'SMEs, food businesses, tailors, healthcare, logistics',
      features: [
        'Custom multi-page website (5–8 pages)',
        'Full product/service catalogue',
        'Booking & order management system',
        'Customer contact database',
        'WhatsApp & social integration',
        'Blog / news section',
        '3 months free support',
      ],
      cta: 'Get Complete Website',
    },
    {
      id: 'ecommerce',
      name: 'E-Commerce Store',
      tagline: 'Sell to all of Nigeria.',
      price: '₦280,000',
      was: '₦650,000',
      deliveryDays: '10 days',
      highlight: false,
      badge: '⭐ Best Value',
      // icon: '🛒',
      idealFor: 'Retailers, fashion brands, food/drinks sellers, distributors',
      features: [
        'Full online store (unlimited products)',
        'Payment gateway (Paystack / Flutterwave)',
        'Order & delivery management',
        'Customer accounts & wishlists',
        'Discount codes & promotions',
        'Inventory tracking',
        'Nigeria-wide shipping integration',
        '6 months free support',
      ],
      cta: 'Get E-Commerce Store',
    },
  ];

  appPackages: Package[] = [
    {
      id: 'webapp',
      name: 'Web Application',
      tagline: 'Custom tools for your business.',
      price: '₦500,000',
      deliveryDays: '3–4 weeks',
      highlight: false,
      // icon: '⚙️',
      idealFor: 'Businesses needing custom dashboards, portals, booking systems',
      features: [
        'Custom web application (Angular / React)',
        'User authentication & roles',
        'Database design & backend API',
        'Admin dashboard',
        'Real-time notifications',
        'Analytics & reporting',
        '6 months support',
      ],
      cta: 'Discuss Web App',
    },
    {
      id: 'mobileapp',
      name: 'Mobile Application',
      tagline: 'Your business in every pocket.',
      price: '₦850,000',
      deliveryDays: '6–8 weeks',
      highlight: true,
      badge: '🚀 Premium',
      // icon: '📱',
      idealFor: 'Scaling businesses, marketplaces, delivery platforms',
      features: [
        'iOS + Android app (React Native)',
        'Custom UI/UX design',
        'Push notifications',
        'Payment integration',
        'Google / App Store submission',
        'User accounts & profiles',
        'Admin web dashboard',
        '12 months support',
      ],
      cta: 'Discuss Mobile App',
    },
    {
      id: 'fullplatform',
      name: 'Full Platform',
      tagline: 'Website + App + CRM — the works.',
      price: 'Custom',
      deliveryDays: 'Quoted',
      highlight: false,
      // icon: '🏗️',
      idealFor: 'Startups, enterprises, marketplaces, SaaS products',
      features: [
        'Everything in Web App + Mobile App',
        'Custom CRM integration',
        'Multi-vendor / marketplace logic',
        'Advanced analytics',
        'Third-party API integrations',
        'Dedicated project manager',
        'Priority 24/7 support',
        'Ongoing development retainer available',
      ],
      cta: 'Get Custom Quote',
    },
  ];

  currentPackages = signal<Package[]>(this.webPackages);

  constructor(private wa: WhatsAppService) {}

  ngOnInit() { this.tick(); this.timer = setInterval(() => this.tick(), 1000); }
  ngOnDestroy() { clearInterval(this.timer); }

  private pad(n: number) { return String(n).padStart(2, '0'); }
  private tick() {
    const d = this.end.getTime() - Date.now();
    if (d <= 0) return;
    this.days.set(this.pad(Math.floor(d / 86400000)));
    this.hours.set(this.pad(Math.floor((d % 86400000) / 3600000)));
    this.mins.set(this.pad(Math.floor((d % 3600000) / 60000)));
    this.secs.set(this.pad(Math.floor((d % 60000) / 1000)));
  }

  setCategory(cat: 'web' | 'app') {
    this.activeCategory.set(cat);
    this.currentPackages.set(cat === 'web' ? this.webPackages : this.appPackages);
  }

  askForAdvice() {
    this.wa.openChat("Hi, I need help choosing the right package for my business. Can you advise me?");
  }

  inquire(pkg: Package) {
    const msg = pkg.price === 'Custom'
      ? `Hi, I'm interested in the *${pkg.name}* package from Marvick Springville. I'd like a custom quote.`
      : `Hi, I'm interested in the *${pkg.name}* package (${pkg.price}) from Marvick Springville. I'd like to know more.`;
    this.wa.openChat(msg);
  }
}

// Add to OfferComponent class:
// import { Router } from '@angular/router';
// constructor(private wa: WhatsAppService, private router: Router) {}
// inquire(pkg: Package) { this.router.navigate(['/get-started']); }
