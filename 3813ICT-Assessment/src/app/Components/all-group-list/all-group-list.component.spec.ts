import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllGroupListComponent } from './all-group-list.component';

xdescribe('AllGroupListComponent', () => {
  let component: AllGroupListComponent;
  let fixture: ComponentFixture<AllGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllGroupListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
