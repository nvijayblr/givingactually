import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocialAuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginSignupComponent implements OnInit {

  loginForm: FormGroup;
  signupForm: FormGroup;
  user: SocialUser;
  isSubmitted = false;
  loginInvalid = false;
  mode = 'login';

  constructor(
    public dialogRef: MatDialogRef<LoginSignupComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private socialAuthService: SocialAuthService
  ) { }

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      console.log(user);
    });

    this.loginForm = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });

    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.email],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    });

  }

  loginSubmit() {
    console.log(this.loginForm.value);
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    console.log('Valid form...');
  }

  signInWithGoogle(): void {
    const fbLoginOptions = {
      scope: 'pages_messaging,pages_messaging_subscriptions,email,pages_show_list,manage_pages'
    }; // https://developers.facebook.com/docs/reference/javascript/FB.login/v2.11
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFB(): void {
    const googleLoginOptions = {
      scope: 'https://www.googleapis.com/auth/userinfo.email'
    }; // https://developers.google.com/api-client-library/javascript/reference/referencedocs#gapiauth2clientconfig

    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.socialAuthService.signOut();
  }

  gotoLoginMode(mode) {
    this.mode = mode;
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
