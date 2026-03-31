import { Pipe, PipeTransform } from '@angular/core';
import { CrmLead, CrmStatus } from '../../features/crm/crm.component';

@Pipe({ name: 'statusCount', standalone: true })
export class StatusCountPipe implements PipeTransform {
  transform(leads: CrmLead[], status: CrmStatus): number {
    return leads.filter(l => l.status === status).length;
  }
}
