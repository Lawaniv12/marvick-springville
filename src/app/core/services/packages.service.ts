import { Injectable } from '@angular/core';

export interface PackageOption {
  id: string;
  name: string;
  tagline: string;
  price: string;
  priceNumber: number; // actual naira value for display
  category: 'web' | 'app';
  deliveryDays: string;
  features: string[];
  idealFor: string;
}

@Injectable({ providedIn: 'root' })
export class PackagesService {
  all: PackageOption[] = [
    {
      id: 'landing',
      name: 'Landing Page',
      tagline: 'Get found. Get calls.',
      price: '₦65,000',
      priceNumber: 65000,
      category: 'web',
      deliveryDays: '3 days',
      idealFor: 'Freelancers, coaches, service providers',
      features: ['Single professional page', 'WhatsApp & social links', 'Mobile optimised', 'Basic SEO', '1 month support'],
    },
    {
      id: 'funnel',
      name: 'Sales Funnel',
      tagline: 'Turn visitors into buyers.',
      price: '₦110,000',
      priceNumber: 110000,
      category: 'web',
      deliveryDays: '5 days',
      idealFor: 'Course sellers, consultants, product launchers',
      features: ['3–5 page funnel', 'Lead capture system', 'Countdown timer', 'WhatsApp follow-up', '2 months support'],
    },
    {
      id: 'website',
      name: 'Complete Website',
      tagline: 'Your full business online.',
      price: '₦149,000',
      priceNumber: 149000,
      category: 'web',
      deliveryDays: '7 days',
      idealFor: 'SMEs, food, fashion, healthcare, logistics',
      features: ['5–8 page custom website', 'Product/service catalogue', 'Booking & order system', 'Customer database', '3 months support'],
    },
    {
      id: 'ecommerce',
      name: 'E-Commerce Store',
      tagline: 'Sell to all of Nigeria.',
      price: '₦280,000',
      priceNumber: 280000,
      category: 'web',
      deliveryDays: '10 days',
      idealFor: 'Retailers, fashion brands, food sellers',
      features: ['Unlimited products', 'Paystack/Flutterwave payment', 'Order & delivery management', 'Discount codes', '6 months support'],
    },
    {
      id: 'webapp',
      name: 'Web Application',
      tagline: 'Custom tools for your business.',
      price: '₦500,000',
      priceNumber: 500000,
      category: 'app',
      deliveryDays: '3–4 weeks',
      idealFor: 'Portals, dashboards, booking platforms',
      features: ['Custom Angular/React app', 'User auth & roles', 'Admin dashboard', 'API & database', '6 months support'],
    },
    {
      id: 'mobileapp',
      name: 'Mobile App',
      tagline: 'Your business in every pocket.',
      price: '₦850,000',
      priceNumber: 850000,
      category: 'app',
      deliveryDays: '6–8 weeks',
      idealFor: 'Scaling businesses, delivery, marketplaces',
      features: ['iOS + Android', 'Push notifications', 'Payment integration', 'App Store submission', '12 months support'],
    },
    {
      id: 'fullplatform',
      name: 'Full Platform',
      tagline: 'Website + App + CRM.',
      price: 'Custom',
      priceNumber: 0,
      category: 'app',
      deliveryDays: 'Quoted',
      idealFor: 'Startups, enterprises, SaaS products',
      features: ['Everything included', 'Custom CRM', 'Analytics', '3rd-party integrations', 'Priority support'],
    },
  ];

  getById(id: string): PackageOption | undefined {
    return this.all.find(p => p.id === id);
  }

  get webPackages() { return this.all.filter(p => p.category === 'web'); }
  get appPackages() { return this.all.filter(p => p.category === 'app'); }
}
