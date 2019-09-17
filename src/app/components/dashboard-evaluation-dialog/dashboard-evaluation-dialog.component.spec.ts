import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardEvaluationDialogComponent } from './dashboard-evaluation-dialog.component';

describe('DashboardEvaluationDialogComponent', () => {
  let component: DashboardEvaluationDialogComponent;
  let fixture: ComponentFixture<DashboardEvaluationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardEvaluationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardEvaluationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
