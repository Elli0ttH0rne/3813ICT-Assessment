import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupScreenComponent } from './user-group-screen.component';

describe('UserGroupScreenComponent', () => {
  let component: UserGroupScreenComponent;
  let fixture: ComponentFixture<UserGroupScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserGroupScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserGroupScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
