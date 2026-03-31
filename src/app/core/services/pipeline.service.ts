import { Injectable, signal } from '@angular/core';
import { Package } from '../../features/landing/components/offer/offer.component';

export interface LeadInfo {
  fullName:      string;
  phone:         string;
  email?:        string;
  businessName:  string;
  businessType:  string;
  serviceWanted: string;
  budgetRange:   string;
  heardFrom:     string;
  message?:      string;
  submittedAt?:  Date;
}

export type PipelineStep = 'info' | 'package' | 'payment' | 'success';

export const BUDGET_RANGES = [
  'Under ₦100,000',
  '₦100,000 – ₦200,000',
  '₦200,000 – ₦400,000',
  '₦400,000 – ₦700,000',
  'Above ₦700,000',
  'Not sure yet',
];

export const HEARD_FROM = [
  'WhatsApp / referral', 'Instagram', 'Facebook',
  'Google search', 'LinkedIn', 'Friend / colleague', 'Other',
];

export const BUSINESS_TYPES = [
  'Food / Catering / Bakery', 'Fashion / Clothing / Tailoring',
  'Health / Beauty / Wellness', 'Retail / E-Commerce',
  'Logistics / Delivery', 'Education / Coaching',
  'Finance / Investment', 'NGO / Foundation',
  'Hospitality / Events', 'Tech / Software', 'Other',
];

// ── Payment structure ─────────────────────────────────────────────────────
// Step 1 (website): ₦5,000 Booking Fee — confirms serious intent, filters time-wasters
//                   This is credited toward the 60% deposit
// Step 2 (call):    60% of package price — paid before work starts (discussed on discovery call)
// Step 3 (delivery):40% balance — paid on project completion
export const BOOKING_FEE = 5000;  // ₦5,000 — paid online to secure slot
export const DEPOSIT_PERCENT  = 60; // % of package price due before work starts
export const BALANCE_PERCENT  = 40; // % of package price due on completion
// ──────────────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class PipelineService {
  currentStep      = signal<PipelineStep>('info');
  leadInfo         = signal<LeadInfo | null>(null);
  selectedPackage  = signal<Package | null>(null);
  paymentReference = signal<string | null>(null);

  private readonly KEY = 'ms_pipeline_leads';

  setStep(step: PipelineStep) {
    this.currentStep.set(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  setLeadInfo(info: LeadInfo)      { this.leadInfo.set(info); }
  setPackage(pkg: Package)         { this.selectedPackage.set(pkg); }

  setPaymentReference(ref: string) {
    this.paymentReference.set(ref);
    this.saveCompletedLead();
  }

  private saveCompletedLead() {
    const lead = {
      ...this.leadInfo(),
      package:      this.selectedPackage()?.name,
      packagePrice: this.selectedPackage()?.price,
      bookingFeePaid: BOOKING_FEE,
      paymentRef:   this.paymentReference(),
      submittedAt:  new Date().toISOString(),
      status:       'booking_confirmed',
    };
    const existing = JSON.parse(localStorage.getItem(this.KEY) ?? '[]');
    existing.unshift(lead);
    localStorage.setItem(this.KEY, JSON.stringify(existing));
  }

  getLeads(): any[] {
    return JSON.parse(localStorage.getItem(this.KEY) ?? '[]');
  }

  reset() {
    this.currentStep.set('info');
    this.leadInfo.set(null);
    this.selectedPackage.set(null);
    this.paymentReference.set(null);
  }
}
