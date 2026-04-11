import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'marvick-springville-ltd';
  loading = signal(true);
  fading  = signal(false);
 
  ngOnInit() {
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
