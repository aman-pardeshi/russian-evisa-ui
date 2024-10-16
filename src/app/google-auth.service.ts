import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

declare var google: any; // Declare google as a global variable

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private clientId = environment.googleClientId;
  private sdkLoaded: boolean = false;

  constructor() {
    this.loadGoogleSDK();
  }

  private loadGoogleSDK(): void {
    if (!this.sdkLoaded) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.sdkLoaded = true;
        this.initializeGoogleLogin();
      };
      document.body.appendChild(script);
    }
  }

  private initializeGoogleLogin() {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse.bind(this),
      });
    }
  }

  public signInWithGoogle() {
    if (typeof google !== 'undefined' && this.sdkLoaded) {
      google.accounts.id.prompt(); // This triggers the Google login dialog
    } else {
      console.error('Google SDK is not loaded yet.');
    }
  }

  private handleCredentialResponse(response: any) {
    console.log('Encoded JWT ID token: ' + response.credential);
    // Send this token to your server to authenticate the user
  }
}
