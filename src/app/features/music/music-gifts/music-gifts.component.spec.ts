import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicGiftsComponent } from './music-gifts.component';

describe('MusicGiftsComponent', () => {
  let component: MusicGiftsComponent;
  let fixture: ComponentFixture<MusicGiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicGiftsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusicGiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
