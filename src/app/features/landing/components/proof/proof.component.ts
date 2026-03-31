import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService, Project } from '../../../../core/services/portfolio.service';

@Component({
  selector: 'app-proof',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proof.component.html',
  styleUrls: ['./proof.component.scss'],
})
export class ProofComponent implements OnInit {
  projects = signal<Project[]>([]);
  loadedImages = signal<Set<string>>(new Set());
  failedImages = signal<Set<string>>(new Set());

  stats = [
    { num: '6+', label: 'Live websites delivered' },
    { num: '3×', label: 'Average revenue growth within 90 days' },
    { num: '7 days', label: 'Average from brief to live website' },
    { num: '24/7', label: 'Your business stays open while you sleep' },
  ];

  constructor(private portfolioService: PortfolioService) {}

  ngOnInit() {
    this.projects.set(this.portfolioService.projects());
  }

  onImageLoad(id: string) {
    this.loadedImages.update(s => new Set([...s, id]));
  }

  onImageError(id: string) {
    this.failedImages.update(s => new Set([...s, id]));
  }

  isImageLoaded(id: string): boolean {
    return this.loadedImages().has(id);
  }

  isImageFailed(id: string): boolean {
    return this.failedImages().has(id);
  }

  openSite(url: string) {
    window.open(url, '_blank');
  }
}
