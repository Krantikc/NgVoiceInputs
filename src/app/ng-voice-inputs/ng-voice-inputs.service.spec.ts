import { TestBed } from '@angular/core/testing';

import { NgVoiceInputsService } from './ng-voice-inputs.service';

describe('NgVoiceInputsService', () => {
  let service: NgVoiceInputsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgVoiceInputsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
