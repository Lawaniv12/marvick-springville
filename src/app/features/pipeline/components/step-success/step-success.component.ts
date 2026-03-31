import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PipelineService } from '../../../../core/services/pipeline.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-step-success',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './step-success.component.html',
  styleUrls: ['./step-success.component.scss'],
})
export class StepSuccessComponent implements OnInit {
  private readonly pipeline = inject(PipelineService);
  private readonly notify   = inject(NotificationService);

  readonly lead = this.pipeline.leadInfo;
  readonly pkg  = this.pipeline.selectedPackage;
  readonly ref  = this.pipeline.paymentReference;
  readonly today = new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' });

  // Safe getters for template
  get firstName(): string { return this.lead()?.fullName?.split(' ')[0] ?? 'there'; }
  get pkgName():   string { return this.pkg()?.name  ?? 'your selected package'; }
  get pkgPrice():  string { return this.pkg()?.price ?? ''; }
  get refCode():   string { return this.ref()        ?? ''; }

    readonly nextSteps = [
    {
      step: '01',
      title: 'We review your brief',
      desc: 'Within 1 hour we review your business info, package, and booking fee payment.',
      time: 'Within 1 hr',
    },
    {
      step: '02',
      title: 'Discovery call scheduled',
      desc: 'We reach out on WhatsApp to book a 30-minute call — we discuss your project and confirm the 60% deposit.',
      time: 'Within 24 hrs',
    },
    {
      step: '03',
      title: '60% deposit & work begins',
      desc: 'Once the deposit is paid (your booking fee is credited toward it), we start designing within 48 hours.',
      time: 'After call',
    },
    {
      step: '04',
      title: 'You review, approve & go live',
      desc: "You get preview links throughout. Once you're satisfied, pay the 40% balance and your site goes live.",
      time: 'Day 1–7',
    },
  ];

  ngOnInit() {
    this.notify.sendClientConfirmation(this.lead(), this.pkg(), this.ref() ?? '');
  }

  saveRef() {
    const text = `Marvick Springville — Payment Confirmation\n\nRef: ${this.refCode}\nPackage: ${this.pkgName}\nAmount Paid: ₦10,000\nDate: ${this.today}\n\nThank you for choosing Marvick Springville.`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `MS-${this.refCode}.txt`; a.click();
    URL.revokeObjectURL(url);
  }
}
