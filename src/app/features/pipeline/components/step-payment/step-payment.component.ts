import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipelineService, BOOKING_FEE } from '../../../../core/services/pipeline.service';
import { PaystackService } from '../../../../core/services/paystack.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { SupabaseService } from '../../../../core/services/supabase.service';

@Component({
  selector: 'app-step-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-payment.component.html',
  styleUrls: ['./step-payment.component.scss'],
})
export class StepPaymentComponent {
  private readonly pipeline = inject(PipelineService);
  private readonly paystack = inject(PaystackService);
  private readonly notify   = inject(NotificationService);
  private readonly supabase = inject(SupabaseService);

  readonly lead       = this.pipeline.leadInfo;
  readonly pkg        = this.pipeline.selectedPackage;
  readonly bookingFee = BOOKING_FEE;
  processing          = signal(false);
  cancelled           = signal(false);

  get fullName():     string { return this.lead()?.fullName     ?? ''; }
  get phone():        string { return this.lead()?.phone        ?? ''; }
  get businessName(): string { return this.lead()?.businessName ?? ''; }
  get businessType(): string { return this.lead()?.businessType ?? ''; }
  // get pkgIcon():      string { return this.pkg()?.icon          ?? ''; }
  get pkgName():      string { return this.pkg()?.name          ?? ''; }
  get pkgTagline():   string { return this.pkg()?.tagline       ?? ''; }
  get pkgPrice():     string { return this.pkg()?.price         ?? ''; }

  get deposit60(): string {
    const n = parseInt((this.pkg()?.price ?? '').replace(/[₦,]/g, ''), 10);
    return isNaN(n) ? 'to be confirmed' : `₦${Math.round(n * 0.6).toLocaleString('en-NG')}`;
  }
  get balance40(): string {
    const n = parseInt((this.pkg()?.price ?? '').replace(/[₦,]/g, ''), 10);
    return isNaN(n) ? 'to be confirmed' : `₦${Math.round(n * 0.4).toLocaleString('en-NG')}`;
  }

  // pay() {
  //   this.processing.set(true);
  //   this.cancelled.set(false);
  //   const ref = this.paystack.generateRef('MS-BKG');

  //   this.paystack.pay({
  //     email:  this.lead()?.email || `${this.lead()?.phone}@client.marvickspringville.com`,
  //     amount: this.bookingFee * 100,
  //     name:   this.lead()?.fullName ?? '',
  //     phone:  this.lead()?.phone,
  //     ref,
  //     metadata: {
  //       'Business Name':    this.lead()?.businessName,
  //       'Business Type':    this.lead()?.businessType,
  //       'Package Selected': this.pkg()?.name,
  //       'Package Price':    this.pkg()?.price,
  //       'Payment Type':     'Booking Fee',
  //     },
  //     onSuccess: (response) => {
  //       this.processing.set(false);
  //       this.pipeline.setPaymentReference(response.reference);

  //       // Save to Supabase — non-blocking, won't affect the user's experience
  //       this.supabase.insertLead({
  //         full_name:        this.lead()?.fullName      ?? '',
  //         phone:            this.lead()?.phone         ?? '',
  //         email:            this.lead()?.email,
  //         business_name:    this.lead()?.businessName  ?? '',
  //         business_type:    this.lead()?.businessType  ?? '',
  //         service_wanted:   this.lead()?.serviceWanted ?? '',
  //         budget_range:     this.lead()?.budgetRange   ?? '',
  //         heard_from:       this.lead()?.heardFrom     ?? '',
  //         message:          this.lead()?.message,
  //         package:          this.pkg()?.name,
  //         package_price:    this.pkg()?.price,
  //         booking_fee_paid: `₦${this.bookingFee.toLocaleString('en-NG')}`,
  //         payment_ref:      response.reference,
  //         status:           'booking_paid',
  //       });

  //       this.notify.notifyOwnerOfDeposit(this.lead(), this.pkg(), response.reference);
  //       this.pipeline.setStep('success');
  //     },
  //     onCancel: () => {
  //       this.processing.set(false);
  //       this.cancelled.set(true);
  //     },
  //   });
  // }
   pay() {
    this.processing.set(true);
    this.cancelled.set(false);
    const ref = this.paystack.generateRef('MS-BKG');
 
    this.paystack.pay({
      email:  this.lead()?.email || `${this.lead()?.phone}@client.marvickspringville.com`,
      amount: this.bookingFee * 100,
      name:   this.lead()?.fullName ?? '',
      phone:  this.lead()?.phone,
      ref,
      metadata: {
        'Business Name':    this.lead()?.businessName,
        'Business Type':    this.lead()?.businessType,
        'Package Selected': this.pkg()?.name,
        'Package Price':    this.pkg()?.price,
        'Payment Type':     'Booking Fee',
      },
      onSuccess: (response) => {
        this.processing.set(false);
        this.pipeline.setPaymentReference(response.reference);
 
        // Update the existing row (created at Step 1) with payment details.
        // We find it by phone number — no duplicate row is created.
        this.supabase.updateByPhone(this.lead()?.phone ?? '', {
          package:          this.pkg()?.name,
          package_price:    this.pkg()?.price,
          booking_fee_paid: `₦${this.bookingFee.toLocaleString('en-NG')}`,
          payment_ref:      response.reference,
          status:           'booking_paid',
        });
 
        this.notify.notifyOwnerOfDeposit(this.lead(), this.pkg(), response.reference);
        this.pipeline.setStep('success');
      },
      onCancel: () => {
        this.processing.set(false);
        this.cancelled.set(true);
        // Row already exists in Supabase with status "form_filled" —
        // it stays there so you can follow up in the CRM.
      },
    });
  }
  
  back() { this.pipeline.setStep('package'); }
}