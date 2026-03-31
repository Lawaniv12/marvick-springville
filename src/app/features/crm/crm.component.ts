import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService, LeadRow } from '../../core/services/supabase.service';
import { StatusCountPipe } from '../../shared/pipes/status-count.pipe';

export interface CrmLead {
  id:             string;
  fullName:       string;
  phone:          string;
  email?:         string;
  businessName:   string;
  businessType:   string;
  serviceWanted:  string;
  budgetRange:    string;
  heardFrom:      string;
  message?:       string;
  package?:       string;
  packagePrice?:  string;
  bookingFeePaid?:string;
  paymentRef?:    string;
  createdAt:      string;
  status:         CrmStatus;
  notes?:         string;
}

export type CrmStatus =
  | 'form_filled'     // filled form, no payment
  | 'package_selected'// reached Step 2
  | 'booking_paid'    // paid ₦5k — serious lead
  | 'contacted'       // you've spoken to them
  | 'deposit_paid'    // 60% received — work started
  | 'completed'       // project done, 40% received
  | 'lost';           // didn't convert

const STATUS_META: Record<CrmStatus, { label: string; color: string; bg: string; next?: CrmStatus; priority: number }> = {
  form_filled:      { label: 'Form Filled',   color: '#9333EA', bg: '#FAF5FF', next: 'contacted',    priority: 3 },
  package_selected: { label: 'Browsing',      color: '#0891B2', bg: '#ECFEFF', next: 'contacted',    priority: 3 },
  booking_paid:     { label: 'Booking Paid',  color: '#1D4ED8', bg: '#EFF6FF', next: 'contacted',    priority: 1 },
  contacted:        { label: 'Contacted',     color: '#D97706', bg: '#FFFBEB', next: 'deposit_paid', priority: 2 },
  deposit_paid:     { label: 'In Progress',   color: '#059669', bg: '#ECFDF5', next: 'completed',    priority: 1 },
  completed:        { label: 'Completed ✓',   color: '#059669', bg: '#ECFDF5',                       priority: 4 },
  lost:             { label: 'Lost',          color: '#DC2626', bg: '#FEF2F2',                       priority: 5 },
};

@Component({
  selector: 'app-crm',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusCountPipe],
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.scss'],
})
export class CrmComponent implements OnInit {
  private readonly supabase = inject(SupabaseService);

  readonly STATUS_META = STATUS_META;
  readonly statuses    = Object.keys(STATUS_META) as CrmStatus[];

  leads        = signal<CrmLead[]>([]);
  loading      = signal(true);
  filterStatus = signal<CrmStatus | 'all'>('all');
  searchQuery  = signal('');
  selectedLead = signal<CrmLead | null>(null);
  editingNote  = signal(false);
  notesDraft   = signal('');

  filteredLeads = computed(() => {
    let list = this.leads();
    const st = this.filterStatus();
    const q  = this.searchQuery().toLowerCase().trim();
    if (st !== 'all') list = list.filter(l => l.status === st);
    if (q) list = list.filter(l =>
      l.fullName.toLowerCase().includes(q)     ||
      l.businessName.toLowerCase().includes(q) ||
      l.phone.includes(q)                      ||
      (l.package ?? '').toLowerCase().includes(q)
    );
    return list;
  });


  stats = computed(() => {
    const all       = this.leads();
    const unpaid    = all.filter(l => ['form_filled', 'package_selected'].includes(l.status));
    const paid      = all.filter(l => ['booking_paid','contacted','deposit_paid','completed'].includes(l.status));
    const completed = all.filter(l => l.status === 'completed');
    const pipeline  = all.reduce((sum, l) => {
      const n = parseInt((l.packagePrice ?? '0').replace(/[₦,]/g, ''), 10);
      return sum + (isNaN(n) ? 0 : n);
    }, 0);
    return {
      total:      all.length,
      unpaid:     unpaid.length,   // people to follow up with
      paid:       paid.length,
      completed:  completed.length,
      pipeline:   `₦${pipeline.toLocaleString('en-NG')}`,
      conversion: all.length ? Math.round((completed.length / all.length) * 100) : 0,
    };
  });


  ngOnInit() { this.loadLeads(); }

  // ── READ ──────────────────────────────────────────────────────────────────
  loadLeads() {
    this.loading.set(true);
    this.supabase.fetchLeads().subscribe(rows => {
      this.leads.set(rows.map(this.mapRow));
      this.loading.set(false);
    });
  }

 private mapRow = (r: LeadRow): CrmLead => ({
    id:             r.id             ?? '',
    fullName:       r.full_name      ?? '',
    phone:          r.phone          ?? '',
    email:          r.email,
    businessName:   r.business_name  ?? '',
    businessType:   r.business_type  ?? '',
    serviceWanted:  r.service_wanted ?? '',
    budgetRange:    r.budget_range   ?? '',
    heardFrom:      r.heard_from     ?? '',
    message:        r.message,
    package:        r.package,
    packagePrice:   r.package_price,
    bookingFeePaid: r.booking_fee_paid,
    paymentRef:     r.payment_ref,
    createdAt:      r.created_at     ?? new Date().toISOString(),
    status:        (r.status as CrmStatus) ?? 'form_filled',
    notes:          r.notes,
  });

  updateStatus(lead: CrmLead, status: CrmStatus) {
    this.leads.update(list => list.map(l => l.id === lead.id ? { ...l, status } : l));
    if (this.selectedLead()?.id === lead.id) this.selectedLead.set({ ...lead, status });
    this.supabase.updateStatus(lead.id, status);
  }
 
  markNextStatus(lead: CrmLead) {
    const next = STATUS_META[lead.status]?.next;
    if (next) this.updateStatus(lead, next);
  }
 

  saveNote() {
    const lead = this.selectedLead();
    if (!lead) return;
    const updated = { ...lead, notes: this.notesDraft() };
    this.leads.update(list => list.map(l => l.id === lead.id ? updated : l));
    this.selectedLead.set(updated);
    this.editingNote.set(false);
    this.supabase.updateNotes(lead.id, this.notesDraft());
  }
 
  deleteLead(lead: CrmLead) {
    if (!confirm(`Delete ${lead.fullName}? This cannot be undone.`)) return;
    this.leads.update(list => list.filter(l => l.id !== lead.id));
    if (this.selectedLead()?.id === lead.id) this.selectedLead.set(null);
    this.supabase.deleteLead(lead.id);
  }
 

  // ── ACTIONS ───────────────────────────────────────────────────────────────
  setFilter(s: CrmStatus | 'all') { this.filterStatus.set(s); }
 
  openWhatsApp(lead: CrmLead) {
    const name  = lead.fullName.split(' ')[0];
    const pkg   = lead.package ?? lead.serviceWanted;
    // Different message based on whether they paid or not
    const msg   = lead.status === 'form_filled' || lead.status === 'package_selected'
      ? `Hi ${name} 👋, this is Marvick Springville. You recently filled our interest form for a *${pkg}*. We'd love to help you get your business online — do you have 5 minutes to chat this week?`
      : `Hi ${name} 👋, this is Marvick Springville following up on your *${pkg}* booking. Are you ready to get started?`;
    const phone = lead.phone.replace(/^0/, '234').replace(/\s/g, '');
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  call(lead: CrmLead)    { window.open(`tel:${lead.phone}`, '_self'); }
  select(lead: CrmLead)  { this.selectedLead.set(lead); this.notesDraft.set(lead.notes ?? ''); this.editingNote.set(false); }
 

  closeDetail() { this.selectedLead.set(null); }

  addManualLead() {
    // Insert blank row into Supabase, then reload
    this.supabase.insertLead({
      full_name: 'New Lead', phone: '', business_name: '',
      business_type: '', service_wanted: '', budget_range: '',
      heard_from: 'Manual entry', status: 'new',
    });
    setTimeout(() => this.loadLeads(), 800);
  }

 exportCSV() {
    const headers = ['Name','Phone','Email','Business','Type','Service','Budget','Package','Price','Status','Date','Notes'];
    const rows    = this.filteredLeads().map(l => [
      l.fullName, l.phone, l.email ?? '', l.businessName, l.businessType,
      l.serviceWanted, l.budgetRange, l.package ?? '', l.packagePrice ?? '',
      STATUS_META[l.status].label, new Date(l.createdAt).toLocaleDateString('en-NG'),
      (l.notes ?? '').replace(/,/g, ';'),
    ]);
    const csv  = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `MS-Leads-${new Date().toISOString().split('T')[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

   statusColor(s: CrmStatus) { return STATUS_META[s]?.color ?? '#6B7280'; }
  statusBg(s: CrmStatus)    { return STATUS_META[s]?.bg    ?? '#F3F4F6'; }
  statusLabel(s: CrmStatus) { return STATUS_META[s]?.label ?? s; }
  hasNext(s: CrmStatus)     { return !!STATUS_META[s]?.next; }
  nextLabel(s: CrmStatus)   { const n = STATUS_META[s]?.next; return n ? STATUS_META[n].label : ''; }
 
  timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const m    = Math.floor(diff / 60000);
    if (m < 60)  return `${m}m ago`;
    const h    = Math.floor(m / 60);
    if (h < 24)  return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }
}