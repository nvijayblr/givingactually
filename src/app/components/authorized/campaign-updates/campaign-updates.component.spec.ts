import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignUpdatesComponent } from './campaign-updates.component';

describe('CampaignUpdatesComponent', () => {
  let component: CampaignUpdatesComponent;
  let fixture: ComponentFixture<CampaignUpdatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignUpdatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignUpdatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
