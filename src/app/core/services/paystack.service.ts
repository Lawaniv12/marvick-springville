import { Injectable } from '@angular/core';

declare var PaystackPop: any;

export interface PaystackConfig {
  email: string;
  amount: number; // in kobo
  name: string;
  phone?: string;
  ref: string;
  metadata?: Record<string, any>;
  onSuccess: (response: { reference: string }) => void;
  onCancel: () => void;
}

@Injectable({ providedIn: 'root' })
export class PaystackService {
  // ← Replace with your actual Paystack PUBLIC key
  private readonly PUBLIC_KEY = 'pk_live_3a9b0cab4490107de6b54719ddd59d480f5134fb';

  pay(config: PaystackConfig): void {
    const handler = PaystackPop.setup({
      key: this.PUBLIC_KEY,
      email: config.email || `${config.phone}@marvickspringville.com`,
      amount: config.amount,
      currency: 'NGN',
      ref: config.ref,
      metadata: {
        custom_fields: [
          { display_name: 'Customer Name', variable_name: 'customer_name', value: config.name },
          { display_name: 'Phone', variable_name: 'phone', value: config.phone ?? '' },
          ...(config.metadata
            ? Object.entries(config.metadata).map(([k, v]) => ({
                display_name: k, variable_name: k.toLowerCase().replace(/ /g, '_'), value: String(v),
              }))
            : []),
        ],
      },
      callback: (response: { reference: string }) => {
        config.onSuccess(response);
      },
      onClose: () => {
        config.onCancel();
      },
    });
    handler.openIframe();
  }

  generateRef(prefix = 'MS'): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  }
}
