import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SocialAuthService } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { HttpService } from '../../services/http-service.service';
import { MessageService } from '../../services/message.service';

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
  isLoading = false;
  errorMessage = '';
  mode = 'login';

  constructor(
    public dialogRef: MatDialogRef<LoginSignupComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private socialAuthService: SocialAuthService,
    private http: HttpService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      if (!user) {
        return;
      }
      this.user = user;
      this.doSocialLogin(this.user);
    });

    this.loginForm = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required],
      grant_type: ['password']
    });

    this.signupForm = this.fb.group({
      DPName: ['', Validators.required],
      UserName: ['', Validators.email],
      Password: ['', Validators.required],
      ConfirmPassword: ['', Validators.required],
      IsNGO: [false],
      canEndorse: [false]
    });
  }

  doLogin() {
    this.isSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.http.loginRequest(this.loginForm.value).subscribe((result: any) => {
      this.isLoading = false;
      this.setLoginSessionAndRouting(result);
    }, (error) => {
      this.isLoading = false;
      this.errorMessage = error.error.ResponseMsg;
    });
  }

  doSignup() {
    this.isSubmitted = true;
    if (this.signupForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.http.signupRequest(this.signupForm.value).subscribe((result: any) => {
      this.isLoading = false;
      const { UserName, Password } = this.signupForm.value;
      // this.setLoginSessionAndRouting(result);
      this.loginForm.controls.username.setValue(UserName);
      this.loginForm.controls.password.setValue(Password);
      this.doLogin();
    }, (error) => {
      this.isLoading = false;
      this.errorMessage = error.error.ResponseMsg;
    });
  }

  doSocialLogin(user) {
    let payload = {};
    if (user.provider === 'GOOGLE') {
      payload = {
        userName: user.email,
        DPName: user.name,
        provider: user.provider,
        AId: user.id,
      };
    } else {
      payload = {
        userName: user.email,
        DPName: user.name,
        provider: user.provider,
        AId: user.id,
      };
    }
    this.isSubmitted = true;
    this.isLoading = true;
    this.http.socialLoginRequest(payload).subscribe((result: any) => {
      this.isLoading = false;
      this.setLoginSessionAndRouting(result, true);
    }, (error) => {
      this.isLoading = false;
      this.errorMessage = error.error.ResponseMsg;
    });
  }

  setLoginSessionAndRouting(result, isSocial?) {
    const session = {
      ...result,
      isLoggedIn: true,
      isSocial
    };
    localStorage.setItem('ga_token', JSON.stringify(session));
    this.messageService.sendLoginMessage(session);
    this.dialogRef.close();
    this.router.navigate([`/accounts/${result.UserId}`]);
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
