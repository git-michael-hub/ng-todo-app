/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthFirebaseService } from './auth-firebase.service';

describe('Service: AuthFirebase', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthFirebaseService]
    });
  });

  it('should ...', inject([AuthFirebaseService], (service: AuthFirebaseService) => {
    expect(service).toBeTruthy();
  }));
});
