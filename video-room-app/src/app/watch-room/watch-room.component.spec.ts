import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchRoomComponent } from './watch-room.component';

describe('WatchRoomComponent', () => {
  let component: WatchRoomComponent;
  let fixture: ComponentFixture<WatchRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WatchRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
