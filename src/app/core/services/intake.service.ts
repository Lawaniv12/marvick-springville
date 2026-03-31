import { Injectable, signal } from '@angular/core';
import { LeadService } from './lead.service';
import { WhatsAppService } from './whatsapp.service';

export interface IntakeForm {
  // Step 1 — Contact
  fullName: string;
  phone: string;
  email?: string;

  // Step 2 — Business
  businessName: string;
  businessType: string;
  businessCity: string;

  // Step 3 — Service
  serviceId: string;
  serviceName: string;
  servicePrice: string;
  budgetRange: string;

  // Step 4 — Source
  referralSource: string;
  message?: string;
}

export interface ServiceOption {
  id: string;
  name: string;
  price: string;
  numericPrice: number; // for deposit calc
  tagline: string;
  deliveryDays: string;
  icon: string;
  category: 'web' | 'app';
}

export const DEPOSIT_AMOUNT = 10000; // ₦10,000
export const DEPOSIT_REFUND_PERCENT = 50; // 50% refundable if they don't proceed

export const SERVICE_OPTIONS: ServiceOption[] = [
  { id: 'landing',    name: 'Landing Page',         price: '₦65,000',   numericPrice: 65000,   tagline: 'Get found. Get calls.',            deliveryDays: '3 days',    icon: '🎯', category: 'web' },
  { id: 'funnel',     name: 'Sales Funnel',          price: '₦110,000',  numericPrice: 110000,  tagline: 'Turn visitors into buyers.',       deliveryDays: '5 days',    icon: '📈', category: 'web' },
  { id: 'website',    name: 'Complete Website',      price: '₦149,000',  numericPrice: 149000,  tagline: 'Your full business online.',        deliveryDays: '7 days',    icon: '🌐', category: 'web' },
  { id: 'ecommerce',  name: 'E-Commerce Store',      price: '₦280,000',  numericPrice: 280000,  tagline: 'Sell to all of Nigeria.',          deliveryDays: '10 days',   icon: '🛒', category: 'web' },
  { id: 'webapp',     name: 'Web Application',       price: '₦500,000',  numericPrice: 500000,  tagline: 'Custom tools for your business.',  deliveryDays: '3–4 weeks', icon: '⚙️', category: 'app' },
  { id: 'mobileapp',  name: 'Mobile Application',    price: '₦850,000',  numericPrice: 850000,  tagline: 'Your business in every pocket.',   deliveryDays: '6–8 weeks', icon: '📱', category: 'app' },
  { id: 'fullplatform', name: 'Full Platform',       price: 'Custom',    numericPrice: 0,       tagline: 'Website + App + CRM — the works.', deliveryDays: 'Quoted',    icon: '🏗️', category: 'app' },
];

export const BUDGET_RANGES = [
  'Under ₦100,000',
  '₦100,000 – ₦200,000',
  '₦200,000 – ₦500,000',
  '₦500,000 – ₦1,000,000',
  'Above ₦1,000,000',
  'Not sure yet',
];

export const REFERRAL_SOURCES = [
  'WhatsApp message',
  'Instagram / Facebook',
  'Twitter / X',
  'Referred by a friend',
  'Google Search',
  'LinkedIn',
  'Other',
];

export const BUSINESS_TYPES = [
  'Food & Catering',
  'Fashion & Tailoring',
  'Retail / Products',
  'Healthcare / Beauty',
  'Logistics & Delivery',
  'Education / Training',
  'Financial Services',
  'Technology',
  'Non-Profit / Foundation',
  'Construction / Real Estate',
  'Hospitality / Events',
  'Consulting / Professional Services',
  'Other',
];

@Injectable({ providedIn: 'root' })
export class IntakeService {
  // Form state persisted across steps
  form = signal<Partial<IntakeForm>>({});
  currentStep = signal(1);
  totalSteps = 4;
  submitted = signal(false);
  paymentInitiated = signal(false);

  serviceOptions = SERVICE_OPTIONS;
  budgetRanges = BUDGET_RANGES;
  referralSources = REFERRAL_SOURCES;
  businessTypes = BUSINESS_TYPES;
  depositAmount = DEPOSIT_AMOUNT;

  constructor(
    private leadService: LeadService,
    private waService: WhatsAppService,
  ) {}

  updateForm(partial: Partial<IntakeForm>) {
    this.form.update(f => ({ ...f, ...partial }));
  }

  nextStep() {
    if (this.currentStep() < this.totalSteps) {
      this.currentStep.update(s => s + 1);
    }
  }

  prevStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  goToStep(n: number) { this.currentStep.set(n); }

  getSelectedService(): ServiceOption | undefined {
    return SERVICE_OPTIONS.find(s => s.id === this.form().serviceId);
  }

  submitLead() {
    const f = this.form();
    if (!f.fullName || !f.phone) return;

    this.leadService.add({
      name: f.fullName,
      phone: f.phone,
      email: f.email,
      businessName: f.businessName,
      package: f.serviceName,
      message: `Business: ${f.businessType} | Budget: ${f.budgetRange} | Source: ${f.referralSource}${f.message ? ' | Note: ' + f.message : ''}`,
      source: 'landing',
    });

    this.submitted.set(true);
  }

  // Called after Paystack payment succeeds
  onPaymentSuccess(reference: string) {
    const f = this.form();
    this.paymentInitiated.set(true);

    // 1. Update lead status
    const leads = this.leadService.leads();
    const lead = leads.find(l => l.name === f.fullName && l.phone === f.phone);
    if (lead) {
      this.leadService.updateStatus(lead.id, 'qualified');
    }

    // 2. Open WhatsApp to notify client (auto-message)
    const clientMsg =
      `Hi ${f.fullName}! 🎉 Your Discovery Deposit for *${f.serviceName}* has been received (Ref: ${reference}).\n\n` +
      `We'll review your project details and reach out within *24 hours* to schedule your discovery call.\n\n` +
      `— Marvick Springville`;
    // Note: in production, send this via Paystack webhook → server → WhatsApp Business API
    // For now, open WA with the message so you can send it manually
    this.waService.openChat(clientMsg);
  }

  reset() {
    this.form.set({});
    this.currentStep.set(1);
    this.submitted.set(false);
    this.paymentInitiated.set(false);
  }
}
