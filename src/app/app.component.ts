import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'marvick-springville-ltd';
  private router = inject(Router);
  loading      = signal(true);
  fading       = signal(false);
  isMusicRoute = signal(false);
 
  ngOnInit() {
    // Track active route to toggle navbar/footer
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: NavigationEnd) => {
        this.isMusicRoute.set(e.urlAfterRedirects.startsWith('/music'));
      });
 
    // Page loader
    const minDisplay = 2400;
    const start = Date.now();
    const finish = () => {
      const elapsed   = Date.now() - start;
      const remaining = Math.max(0, minDisplay - elapsed);
      setTimeout(() => {
        this.fading.set(true);
        setTimeout(() => this.loading.set(false), 650);
      }, remaining);
    };
 
    if (document.readyState === 'complete') {
      finish();
    } else {
      window.addEventListener('load', finish, { once: true });
    }
  }
}
