import { Injectable, signal, computed } from '@angular/core';

export type LeadStatus = 'new' | 'deposited' | 'in_progress' | 'completed' | 'cancelled';
export type LeadSource = 'landing_form' | 'whatsapp' | 'referral' | 'portfolio' | 'other';

export interface Lead {
  id: string;
  // Contact
  name: string;
  phone: string;
  email: string;
  // Business
  businessName: string;
  businessType: string;
  // Project
  packageId: string;
  packageName: string;
  budgetRange: string;
  // Meta
  source: LeadSource;
  referredBy?: string;
  status: LeadStatus;
  notes?: string;
  // Payment
  depositPaid: boolean;
  depositReference?: string;
  depositPaidAt?: string;
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface LeadFormData {
  name: string;
  phone: string;
  email: string;
  businessName: string;
  businessType: string;
  packageId: string;
  packageName: string;
  budgetRange: string;
  referredBy: string;
}

@Injectable({ providedIn: 'root' })
export class LeadService {
  private readonly KEY = 'ms_leads';
  leads = signal<Lead[]>(this.load());

  // Computed stats for CRM dashboard
  totalLeads = computed(() => this.leads().length);
  depositedLeads = computed(() => this.leads().filter(l => l.depositPaid));
  newLeads = computed(() => this.leads().filter(l => l.status === 'new'));
  totalDepositsNaira = computed(() => this.depositedLeads().length * 10000);

  private load(): Lead[] {
    try { return JSON.parse(localStorage.getItem(this.KEY) ?? '[]'); }
    catch { return []; }
  }

  private save() {
    localStorage.setItem(this.KEY, JSON.stringify(this.leads()));
  }

  submit(form: LeadFormData): Lead {
    const lead: Lead = {
      ...form,
      id: crypto.randomUUID(),
      source: 'landing_form',
      status: 'new',
      depositPaid: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.leads.update(l => [lead, ...l]);
    this.save();
    // Store current lead for confirmation page
    sessionStorage.setItem('ms_current_lead', JSON.stringify(lead));
    return lead;
  }

  markDepositPaid(id: string, reference: string): Lead | null {
    let updated: Lead | null = null;
    this.leads.update(list =>
      list.map(l => {
        if (l.id === id) {
          updated = { ...l, status: 'deposited', depositPaid: true, depositReference: reference, depositPaidAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
          return updated;
        }
        return l;
      })
    );
    this.save();
    if (updated) sessionStorage.setItem('ms_current_lead', JSON.stringify(updated));
    return updated;
  }

  getCurrentLead(): Lead | null {
    try { return JSON.parse(sessionStorage.getItem('ms_current_lead') ?? 'null'); }
    catch { return null; }
  }

  updateStatus(id: string, status: LeadStatus, notes?: string) {
    this.leads.update(l => l.map(x =>
      x.id === id ? { ...x, status, notes: notes ?? x.notes, updatedAt: new Date().toISOString() } : x
    ));
    this.save();
  }

  getById(id: string): Lead | undefined {
    return this.leads().find(l => l.id === id);
  }
}
