import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { PainSectionComponent } from './components/pain-section/pain-section.component';
import { SolutionComponent } from './components/solution/solution.component';
import { ProofComponent } from './components/proof/proof.component';
import { OfferComponent } from './components/offer/offer.component';
import { ProcessComponent } from './components/process/process.component';
import { FinalCtaComponent } from './components/final-cta/final-cta.component';
import { WhatsappButtonComponent } from './components/whatsapp-button/whatsapp-button.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    HeroComponent, PainSectionComponent, SolutionComponent,
    ProofComponent, OfferComponent, ProcessComponent,
    FinalCtaComponent, WhatsappButtonComponent,
  ],
  template: `
    <app-hero />
    <app-pain-section />
    <app-solution />
    <app-proof />
    <app-offer />
    <app-process />
    <app-final-cta />
    <app-whatsapp-button />
  `,
})
export class LandingComponent {}
