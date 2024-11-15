import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrPanelComponent } from './pr-panel.component';

describe('PrPanelComponent', () => {
  let component: PrPanelComponent;
  let fixture: ComponentFixture<PrPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
