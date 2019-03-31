import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamRoomComponent } from './stream-room.component';

describe('StreamRoomComponent', () => {
  let component: StreamRoomComponent;
  let fixture: ComponentFixture<StreamRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
