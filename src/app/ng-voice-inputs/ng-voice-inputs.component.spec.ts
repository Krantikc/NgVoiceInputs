import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgVoiceInputsComponent } from './ng-voice-inputs.component';

describe('NgVoiceInputsComponent', () => {
  let component: NgVoiceInputsComponent;
  let fixture: ComponentFixture<NgVoiceInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgVoiceInputsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgVoiceInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
