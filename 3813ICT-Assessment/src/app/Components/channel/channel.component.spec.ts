import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelComponent } from './channel.component';

xdescribe('ChannelComponent', () => {
  let component: ChannelComponent;
  let fixture: ComponentFixture<ChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
