import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MePanelComponent } from './me-panel.component';

describe('MePanelComponent', () => {
  let component: MePanelComponent;
  let fixture: ComponentFixture<MePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MePanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
