import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicStoreComponent } from './music-store.component';

describe('MusicStoreComponent', () => {
  let component: MusicStoreComponent;
  let fixture: ComponentFixture<MusicStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusicStoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusicStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
