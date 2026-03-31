import { Injectable } from '@angular/core';
import { LeadInfo } from './pipeline.service';
import { Package } from '../../features/landing/components/offer/offer.component';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly YOUR_WHATSAPP = '2347017909308'; // ← Replace with your number

  notifyOwnerOfDeposit(lead: LeadInfo | null, pkg: Package | null, ref: string): void {
    const msg = this.buildOwnerAlert(lead, pkg, ref);
    window.open(`https://wa.me/${this.YOUR_WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  sendClientConfirmation(lead: LeadInfo | null, pkg: Package | null, ref: string): void {
    setTimeout(() => {
      const msg = this.buildClientConfirmation(lead, pkg, ref);
      window.open(`https://wa.me/${this.YOUR_WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
    }, 1500);
  }

  private buildOwnerAlert(lead: LeadInfo | null, pkg: Package | null, ref: string): string {
    return `🔔 *NEW BOOKING — Marvick Springville*

💳 Booking Fee: ₦5,000 PAID
📌 Ref: ${ref}

👤 *Client Details*
Name: ${lead?.fullName ?? '—'}
Phone: ${lead?.phone ?? '—'}
Business: ${lead?.businessName ?? '—'} (${lead?.businessType ?? '—'})
Service wanted: ${lead?.serviceWanted ?? '—'}
Budget range: ${lead?.budgetRange ?? '—'}
Heard from: ${lead?.heardFrom ?? '—'}
${lead?.message ? `\nMessage: ${lead.message}` : ''}

📦 *Selected Package*
${pkg?.name ?? '—'} — ${pkg?.price ?? '—'}

💰 *Next Steps*
1. Call this client within 24 hours
2. Discuss project scope & confirm 60% deposit (${pkg ? '₦' + Math.round(parseInt((pkg.price ?? '0').replace(/[₦,]/g, ''), 10) * 0.6).toLocaleString('en-NG') : 'TBC'})
3. Begin work after deposit is received
4. Collect 40% balance on delivery

⏰ ${new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })}`;
  }

  private buildClientConfirmation(lead: LeadInfo | null, pkg: Package | null, ref: string): string {
    const price = parseInt((pkg?.price ?? '0').replace(/[₦,]/g, ''), 10);
    const dep60 = isNaN(price) ? 'to be confirmed' : `₦${Math.round(price * 0.6).toLocaleString('en-NG')}`;
    const bal40 = isNaN(price) ? 'to be confirmed' : `₦${Math.round(price * 0.4).toLocaleString('en-NG')}`;

    return `Hi ${lead?.fullName?.split(' ')[0] ?? 'there'} 👋

This is Marvick Springville.

✅ *Booking Confirmed — Slot Reserved!*

Here's your project summary:
• Package: *${pkg?.name ?? 'to be confirmed'}*
• Total cost: *${pkg?.price ?? '—'}*
• Booking Fee paid: *₦5,000* ✓ (credited to your deposit)
• Reference: ${ref}

💰 *Payment Schedule*
• 60% Deposit: ${dep60} — due before work starts
• 40% Balance: ${bal40} — due on delivery

*What happens next:*
1. We'll call you within 24 hours to discuss your project
2. We'll send your project brief & payment link
3. Once 60% is confirmed, we start building immediately 🚀

Thank you for choosing Marvick Springville.
Your business is about to grow.`;
  }
}
