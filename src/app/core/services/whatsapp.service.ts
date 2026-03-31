import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WhatsAppService {
  // ← UPDATE THIS with your real WhatsApp number (include country code, no + sign)
  private phone = '23487017909308';
  private brand = 'Marvick Springville';

  openChat(message?: string) {
    const text = message ?? `Hi ${this.brand}, I'm interested in getting a website for my business.`;
    window.open(`https://wa.me/${this.phone}?text=${encodeURIComponent(text)}`, '_blank');
  }

  openPackageInquiry(packageName: string) {
    this.openChat(`Hi, I'm interested in the *${packageName}* package from ${this.brand}. I'd like to know more.`);
  }
}
