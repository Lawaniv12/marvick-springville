import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipelineService, PipelineStep } from '../../core/services/pipeline.service';
import { StepInfoComponent } from './components/step-info/step-info.component';
import { StepPackageComponent } from './components/step-package/step-package.component';
import { StepPaymentComponent } from './components/step-payment/step-payment.component';
import { StepSuccessComponent } from './components/step-success/step-success.component';

@Component({
  selector: 'app-pipeline',
  standalone: true,
  imports: [CommonModule, StepInfoComponent, StepPackageComponent, StepPaymentComponent, StepSuccessComponent],
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.scss'],
})
export class PipelineComponent {
  readonly pipeline = inject(PipelineService);
  readonly currentStep = this.pipeline.currentStep;

  readonly steps: { id: PipelineStep; label: string }[] = [
    { id: 'info',    label: 'Your Details'   },
    { id: 'package', label: 'Choose Package' },
    { id: 'payment', label: 'Pay Deposit'    },
    { id: 'success', label: 'Confirmed'      },
  ];

  stepIndex(step: PipelineStep): number {
    return this.steps.findIndex(s => s.id === step);
  }
  isComplete(step: PipelineStep): boolean {
    return this.stepIndex(step) < this.stepIndex(this.currentStep());
  }
  isCurrent(step: PipelineStep): boolean {
    return step === this.currentStep();
  }
}
