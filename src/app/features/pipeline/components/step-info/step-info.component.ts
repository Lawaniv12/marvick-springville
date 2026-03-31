import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PipelineService, BUSINESS_TYPES, BUDGET_RANGES, HEARD_FROM, LeadInfo } from '../../../../core/services/pipeline.service';
import { SupabaseService } from '../../../../core/services/supabase.service';

@Component({
  selector: 'app-step-info',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './step-info.component.html',
  styleUrls: ['./step-info.component.scss'],
})
export class StepInfoComponent {
  readonly pipeline = inject(PipelineService);
  readonly supabase = inject(SupabaseService);

  readonly businessTypes = BUSINESS_TYPES;
  readonly budgetRanges  = BUDGET_RANGES;
  readonly heardFrom     = HEARD_FROM;
  readonly serviceOptions = [
    'Landing Page', 'Sales Funnel', 'Complete Website',
    'E-Commerce Store', 'Web Application', 'Mobile App', 'Full Platform', 'Not sure yet',
  ];

  submitting = signal(false);
  errors     = signal<Record<string, string>>({});

  form: LeadInfo = {
    fullName: '', phone: '', email: '', businessName: '',
    businessType: '', serviceWanted: '', budgetRange: '', heardFrom: '', message: '',
  };

  constructor() {
    const pkg = this.pipeline.selectedPackage();
    if (pkg) this.form.serviceWanted = pkg.name;
  }

  validate(): boolean {
    const e: Record<string, string> = {};
    if (!this.form.fullName.trim())    e['fullName']     = 'Please enter your full name';
    if (!this.form.phone.trim())       e['phone']        = 'Phone number is required';
    else if (!/^(\+234|0)\d{10}$/.test(this.form.phone.replace(/\s/g, '')))
                                        e['phone']        = 'Enter a valid Nigerian phone number';
    if (!this.form.businessName.trim())e['businessName'] = 'Business name is required';
    if (!this.form.businessType)       e['businessType'] = 'Please select your business type';
    if (!this.form.serviceWanted)      e['serviceWanted']= 'Please select a service';
    if (!this.form.budgetRange)        e['budgetRange']  = 'Please select a budget range';
    if (!this.form.heardFrom)          e['heardFrom']    = 'Please tell us how you found us';
    this.errors.set(e);
    return Object.keys(e).length === 0;
  }

  submit() {
    if (!this.validate()) return;
    this.submitting.set(true);
 
    const leadData = { ...this.form, submittedAt: new Date() };
    this.pipeline.setLeadInfo(leadData);
 
    // ── Save to Supabase immediately — before any payment ─────────────────
    // This captures warm leads who fill the form but don't complete payment.
    // Status "form_filled" means: interested but hasn't paid yet.
    // The record will be updated to "booking_paid" when payment succeeds.
    this.supabase.insertLead({
      full_name:       this.form.fullName,
      phone:           this.form.phone,
      email:           this.form.email,
      business_name:   this.form.businessName,
      business_type:   this.form.businessType,
      service_wanted:  this.form.serviceWanted,
      budget_range:    this.form.budgetRange,
      heard_from:      this.form.heardFrom,
      message:         this.form.message,
      status:          'form_filled',   // will be updated on payment success
    });
 
    setTimeout(() => {
      this.pipeline.setStep('package');
      this.submitting.set(false);
    }, 600);
  }

  hasError(f: string) { return !!this.errors()[f]; }
  getError(f: string) { return this.errors()[f]; }
}
