import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService, Project } from '../../core/services/portfolio.service';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements OnInit {
  projects = signal<Project[]>([]);
  loadedImages = signal<Set<string>>(new Set());
  failedImages = signal<Set<string>>(new Set());

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit() { this.projects.set(this.portfolioService.projects()); }

  onLoad(id: string) { this.loadedImages.update(s => new Set([...s, id])); }
  onError(id: string) { this.failedImages.update(s => new Set([...s, id])); }
  isLoaded(id: string) { return this.loadedImages().has(id); }
  isFailed(id: string) { return this.failedImages().has(id); }
  open(url: string) { window.open(url, '_blank'); }
}
