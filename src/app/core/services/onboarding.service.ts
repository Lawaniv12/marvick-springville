import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface OnboardingLead {
  // Form data
  name: string;
  phone: string;
  email?: string;
  businessName: string;
  businessType: string;
  serviceId: string;
  serviceName: string;
  servicePrice: string;
  budgetRange: string;
  referralSource: string;
  notes?: string;
  // System data
  id: string;
  status: 'form_submitted' | 'deposit_pending' | 'deposit_paid' | 'in_progress' | 'completed' | 'cancelled';
  paystackRef?: string;
  createdAt: string;
}

export interface ServiceOption {
  id: string;
  name: string;
  price: string;
  priceNum: number; // for display/logic
  deliveryDays: string;
  tagline: string;
  category: 'web' | 'app';
}

@Injectable({ providedIn: 'root' })
export class OnboardingService {

  // ── CONFIG — update these ──────────────────────────────────────────────────
  readonly PAYSTACK_PUBLIC_KEY = 'pk_live_YOUR_PAYSTACK_PUBLIC_KEY';   // ← your key
  readonly DEPOSIT_AMOUNT_KOBO = 1000000;   // ₦10,000 in kobo (Paystack uses kobo)
  readonly DEPOSIT_LABEL = '₦10,000';
  readonly WHATSAPP_NUMBER = '2347017909308';  // ← your number
  readonly BUSINESS_EMAIL = 'hello@marvickspringville.com'; // ← your email
  // ──────────────────────────────────────────────────────────────────────────

  readonly STORAGE_KEY = 'ms_onboarding_leads';

  currentLead = signal<Partial<OnboardingLead> | null>(null);
  leads = signal<OnboardingLead[]>(this.loadLeads());

  services: ServiceOption[] = [
    { id: 'landing',    name: 'Landing Page',       price: '₦65,000',   priceNum: 65000,   deliveryDays: '3 days',    tagline: 'Get found. Get calls.',        category: 'web' },
    { id: 'funnel',     name: 'Sales Funnel',        price: '₦110,000',  priceNum: 110000,  deliveryDays: '5 days',    tagline: 'Turn visitors into buyers.',    category: 'web' },
    { id: 'website',    name: 'Complete Website',    price: '₦149,000',  priceNum: 149000,  deliveryDays: '7 days',    tagline: 'Your full business online.',    category: 'web' },
    { id: 'ecommerce',  name: 'E-Commerce Store',    price: '₦280,000',  priceNum: 280000,  deliveryDays: '10 days',   tagline: 'Sell to all of Nigeria.',       category: 'web' },
    { id: 'webapp',     name: 'Web Application',     price: '₦500,000',  priceNum: 500000,  deliveryDays: '3-4 weeks', tagline: 'Custom tools for your business.',category: 'app' },
    { id: 'mobileapp',  name: 'Mobile Application',  price: '₦850,000',  priceNum: 850000,  deliveryDays: '6-8 weeks', tagline: 'Your business in every pocket.', category: 'app' },
    { id: 'platform',   name: 'Full Platform',       price: 'Custom',    priceNum: 0,       deliveryDays: 'Quoted',    tagline: 'Website + App + CRM — the works.',category: 'app'},
  ];

  budgetRanges = [
    'Under ₦100,000',
    '₦100,000 – ₦200,000',
    '₦200,000 – ₦500,000',
    '₦500,000 – ₦1,000,000',
    'Over ₦1,000,000',
    'Not sure yet',
  ];

  referralSources = [
    'WhatsApp / Word of mouth',
    'Instagram',
    'Facebook',
    'Google Search',
    'LinkedIn',
    'Referred by someone',
    'Other',
  ];

  businessTypes = [
    'Food / Catering / Bakery',
    'Fashion / Tailoring / Beauty',
    'Healthcare / Wellness',
    'Retail / E-Commerce',
    'Logistics / Delivery',
    'Education / Training',
    'Finance / Consulting',
    'Real Estate',
    'Non-Profit / Foundation',
    'Technology / Startup',
    'Other',
  ];

  constructor(private http: HttpClient) {}

  saveLead(data: Partial<OnboardingLead>) {
    this.currentLead.set(data);
    // Also persist partially so nothing is lost on refresh
    sessionStorage.setItem('ms_current_lead', JSON.stringify(data));
  }

  loadCurrentLead(): Partial<OnboardingLead> | null {
    try {
      const raw = sessionStorage.getItem('ms_current_lead');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  commitLead(lead: OnboardingLead) {
    this.leads.update(list => [lead, ...list]);
    this.persistLeads();
    sessionStorage.removeItem('ms_current_lead');
  }

  updateLeadStatus(id: string, status: OnboardingLead['status'], paystackRef?: string) {
    this.leads.update(list =>
      list.map(l => l.id === id ? { ...l, status, ...(paystackRef ? { paystackRef } : {}) } : l)
    );
    this.persistLeads();
  }

  getServiceById(id: string): ServiceOption | undefined {
    return this.services.find(s => s.id === id);
  }

  // ── WhatsApp notification to you ──
  sendOwnerNotification(lead: Partial<OnboardingLead>) {
    const msg =
      `🔔 *New Lead — Marvick Springville*\n\n` +
      `👤 *Name:* ${lead.name}\n` +
      `📞 *Phone:* ${lead.phone}\n` +
      `🏢 *Business:* ${lead.businessName} (${lead.businessType})\n` +
      `📦 *Service Wanted:* ${lead.serviceName} (${lead.servicePrice})\n` +
      `💰 *Budget:* ${lead.budgetRange}\n` +
      `📣 *Found us via:* ${lead.referralSource}\n` +
      `✅ *Status:* Deposit PAID — ₦10,000\n` +
      `🔑 *Paystack Ref:* ${lead.paystackRef ?? 'N/A'}\n\n` +
      `Reply to close the deal!`;
    window.open(`https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  private loadLeads(): OnboardingLead[] {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_KEY) ?? '[]'); }
    catch { return []; }
  }

  private persistLeads() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.leads()));
  }
}
