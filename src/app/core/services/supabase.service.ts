
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

// ── CONFIGURATION ─────────────────────────────────────────────────────────────
// After creating your Supabase project:
// 1. Go to Project Settings → API
// 2. Copy your Project URL and anon public key
// 3. Paste them below — that is all you need to do here
const SUPABASE_URL  = 'https://vamkshnhrolkccasmqpk.supabase.co';   // e.g. https://xxxx.supabase.co
const SUPABASE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhbWtzaG5ocm9sa2NjYXNtcXBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NTM3MzQsImV4cCI6MjA5MDQyOTczNH0.IT42smMAMXeypexOomxVe6H9p_f-IfWB-qChANBNuUk';      // long string starting with eyJ...
// ─────────────────────────────────────────────────────────────────────────────

export interface LeadRow {
  id?:               string;
  full_name:         string;
  phone:             string;
  email?:            string;
  business_name:     string;
  business_type:     string;
  service_wanted:    string;
  budget_range:      string;
  heard_from:        string;
  message?:          string;
  package?:          string;
  package_price?:    string;
  booking_fee_paid?: string;
  payment_ref?:      string;
  status?:           string;
  notes?:            string;
  created_at?:       string;
  updated_at?:       string;
}


@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly http    = inject(HttpClient);
  private readonly table   = `${SUPABASE_URL}/rest/v1/leads`;
  private readonly headers = new HttpHeaders({
    'apikey':        SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type':  'application/json',
    'Prefer':        'return=representation',
  });
 
  private get configured(): boolean {
    return !SUPABASE_URL.includes('YOUR_') && !SUPABASE_KEY.includes('YOUR_');
  }


  // ── CREATE ─────────────────────────────────────────────────────────────────
  insertLead(lead: Partial<LeadRow>): void {
    if (!this.configured) { console.warn('Supabase not configured.'); return; }
    const h = this.headers.set('Prefer', 'resolution=merge-duplicates,return=representation');
    this.http
      .post<LeadRow[]>(`${this.table}?on_conflict=phone`, { ...lead, updated_at: new Date().toISOString() }, { headers: h })
      .pipe(catchError(err => { console.error('insert failed:', err); return of(null); }))
      .subscribe(res => { if (res) console.log('Saved to Supabase', res[0]?.id); });
  }
 
  // Called on payment success — finds the row by phone and upgrades it
  updateByPhone(phone: string, updates: Partial<LeadRow>): void {
    if (!this.configured) return;
    const clean = encodeURIComponent(phone.replace(/\s/g, ''));
    this.http
      .patch(`${this.table}?phone=eq.${clean}`, { ...updates, updated_at: new Date().toISOString() }, { headers: this.headers })
      .pipe(catchError(err => { console.error('updateByPhone failed:', err); return of(null); }))
      .subscribe();
  }
 
  // Called from CRM to change status
  updateStatus(id: string, status: string): void {
    if (!this.configured) return;
    this.http
      .patch(`${this.table}?id=eq.${id}`, { status, updated_at: new Date().toISOString() }, { headers: this.headers })
      .pipe(catchError(err => { console.error('updateStatus failed:', err); return of(null); }))
      .subscribe();
  }

  // Called when CRM loads — returns all leads newest first
  fetchLeads() {
    if (!this.configured) return of([] as LeadRow[]);
    return this.http
      .get<LeadRow[]>(`${this.table}?order=created_at.desc`, { headers: this.headers })
      .pipe(catchError(() => of([] as LeadRow[])));
  }

 

   // Called from CRM to save notes
  updateNotes(id: string, notes: string): void {
    if (!this.configured) return;
    this.http
      .patch(`${this.table}?id=eq.${id}`, { notes, updated_at: new Date().toISOString() }, { headers: this.headers })
      .pipe(catchError(err => { console.error('updateNotes failed:', err); return of(null); }))
      .subscribe();
  }

   // Called from CRM delete button
  deleteLead(id: string): void {
    if (!this.configured) return;
    this.http
      .delete(`${this.table}?id=eq.${id}`, { headers: this.headers })
      .pipe(catchError(err => { console.error('delete failed:', err); return of(null); }))
      .subscribe();
  }
}