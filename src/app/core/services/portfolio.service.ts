import { Injectable, signal } from '@angular/core';

export interface Project {
  id: string;
  title: string;
  category: string;
  tag: string;
  url: string;
  desc: string;
  screenshotUrl: string;
  gradient: string;
  accentColor: string;
}

@Injectable({ providedIn: 'root' })
export class PortfolioService {

  // ── Screenshot config ──────────────────────────────────────────────────────
  // Sign up FREE at https://screenshotone.com (100/month free tier)
  // Replace YOUR_KEY below with your actual key.
  // Until then, elegant browser-mockup fallbacks display automatically.
  private readonly API_KEY = 'd8DOx6KdNim5Gg';
  private readonly SS = (url: string) =>
    `https://api.screenshotone.com/take?access_key=${this.API_KEY}` +
    `&url=${encodeURIComponent(url)}` +
    `&format=jpg&viewport_width=1440&viewport_height=900` +
    `&image_quality=80&block_ads=true&block_cookie_banners=true` +
    `&delay=1&timeout=15`;
  // ──────────────────────────────────────────────────────────────────────────

  projects = signal<Project[]>([
    {
      id: 'sekada',
      title: 'Sekada LLC',
      category: 'Cybersecurity Agency',
      tag: 'Corporate',
      url: 'https://sekada.macdigitalhelper.com/',
      desc: 'Enterprise cybersecurity agency — risk assessment, GRC services, and compliance. Professional multi-page site with resources and blog.',
      screenshotUrl: this.SS('https://sekada.macdigitalhelper.com/'),
      gradient: 'from-slate-900 to-slate-800',
      accentColor: '#4A90D9',
    },
    {
      id: 'kc4id',
      title: 'Kingstone Consult (KC4ID)',
      category: 'International Development',
      tag: 'NGO',
      url: 'https://www.kc4id.org/',
      desc: 'International development consultancy transforming Africa through health systems, climate resilience, strategic advisory and education.',
      screenshotUrl: this.SS('https://www.kc4id.org/'),
      gradient: 'from-green-950 to-emerald-900',
      accentColor: '#22C55E',
    },
    {
      id: 'sosweet',
      title: 'So Sweet Bakery',
      category: 'Food & Bakery',
      tag: 'E-Commerce',
      url: 'https://sosweetbakery.org/',
      desc: 'Premium custom cakes, private baking classes and event bookings. Full reservation system, flavour menu and allergy information.',
      screenshotUrl: this.SS('https://sosweetbakery.org/'),
      gradient: 'from-rose-950 to-pink-900',
      accentColor: '#F472B6',
    },
    {
      id: 'lovecity',
      title: 'Love City Healthcare',
      category: 'Healthcare',
      tag: 'Healthcare',
      url: 'https://lovecityhealthcare.com/',
      desc: 'Patient-focused healthcare platform with service listings, appointment scheduling and professional medical branding.',
      screenshotUrl: this.SS('https://lovecityhealthcare.com/'),
      gradient: 'from-blue-950 to-cyan-900',
      accentColor: '#06B6D4',
    },
    {
      id: 'annsalem',
      title: 'AnnSalem LifeBridge Foundation',
      category: 'Non-Profit Foundation',
      tag: 'Foundation',
      url: 'https://www.annsalemlifebridgefoundation.org/',
      desc: 'Foundation rebuilding broken bridges — event management, community outreach and fundraising platform with full social integration.',
      screenshotUrl: this.SS('https://www.annsalemlifebridgefoundation.org/'),
      gradient: 'from-amber-950 to-orange-900',
      accentColor: '#F59E0B',
    },
    {
      id: 'classiqaz',
      title: 'Classiqaz Stores',
      category: 'UK E-Commerce Retail',
      tag: 'WooCommerce',
      url: 'https://www.classiqaz.co.uk/',
      desc: 'Premium UK snacks and energy drinks store. Full WooCommerce with 53+ products, UK-wide delivery, category management and brand identity.',
      screenshotUrl: this.SS('https://www.classiqaz.co.uk/'),
      gradient: 'from-purple-950 to-violet-900',
      accentColor: '#A78BFA',
    },
    {
      id: 'insightbridge',
      title: 'InsightBridge24',
      category: 'AI Business Intelligence',
      tag: 'Web App',
      url: 'https://insightbridge24.com/',
      desc: 'Emotionally intelligent AI companion that turns business data into clear insights and next steps — no analysts needed. Upload & get results in seconds.',
      screenshotUrl: this.SS('https://insightbridge24.com/'),
      gradient: 'from-indigo-950 to-blue-900',
      accentColor: '#6366F1',
    },
    {
      id: 'mdh',
      title: 'Mac Digital Helpers',
      category: 'Digital / IT',
      tag: 'IT Solutions',
      url: 'https://macdigitalhelper.com/',
      desc: 'Branding and website design that helps small businesses stand out, grow online, and convert visitors into clients',
      screenshotUrl: this.SS('https://macdigitalhelper.com/'),
      gradient: 'from-teal-950 to-green-900',
      accentColor: '#14B8A6',
    },
    {
      id: 'optimus',
      title: 'Optimus Bank',
      category: 'Financial Services / Banking',
      tag: 'Fintech',
      url: 'https://www.optimusbank.com/',
      desc: 'Modern Nigerian digital bank — clean fintech branding, product pages, compliance sections and fully responsive banking platform.',
      screenshotUrl: this.SS('https://www.optimusbank.com/'),
      gradient: 'from-sky-950 to-blue-900',
      accentColor: '#0EA5E9',
    },
  ]);

  // Easily add future projects here — both the proof section and portfolio page update automatically
  addProject(project: Project) {
    this.projects.update(list => [...list, project]);
  }
}
