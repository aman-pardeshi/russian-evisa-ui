import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

declare var google: any; // Declare google as a global variable

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private clientId = environment.googleClientId;
  private sdkLoaded: boolean = false;

  constructor() {}

  signInWithGoogle() {}
}
