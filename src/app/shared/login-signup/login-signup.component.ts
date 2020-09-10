import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, Subscriber } from 'rxjs';
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
  otpForm: FormGroup;
  user: SocialUser;
  isSubmitted = false;
  isLoading = false;
  errorMessage = '';
  mode = 'login';
  isOtpScreen = false;
  isConfirmPasswordError = false;
  isAcceptTermsError = false;

  ngoList: any = {
    ngoSectors: [],
    ngoTypes: []
  };

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
    this.getNGOList();
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
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      DPPath: [''],
      UserName: ['', [Validators.required, Validators.email]],
      Password: ['', Validators.required],
      ConfirmPassword: ['', Validators.required],
      IsNGO: [false],
      CanEndorse: [false],
      NGOSector: [''],
      NGOType: [''],
      RegisterationNo: [''],
      Registeredat: [''],
      cityName: [''],
      stateName: [''],
      countryName: [''],
      AcceptTerms: [false, [Validators.required]],
    });

    this.otpForm = this.fb.group({
      UserName: [''],
      SecurityToken: ['', Validators.required]
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

    if (this.signupForm.controls.Password.value !== this.signupForm.controls.ConfirmPassword.value) {
      this.isConfirmPasswordError = true;
      return;
    }

    if (!this.signupForm.value.AcceptTerms) {
      this.isAcceptTermsError = true;
      return;
    }

    this.isLoading = true;
    this.http.signupRequest(this.signupForm.value).subscribe((result: any) => {
      this.isLoading = false;
      this.isOtpScreen = true;
      const { UserName, Password } = this.signupForm.value;
      this.otpForm.controls.UserName.setValue(UserName);
      this.loginForm.controls.username.setValue(UserName);
      this.loginForm.controls.password.setValue(Password);
      this.errorMessage = '';
      // this.doLogin();
    }, (error) => {
      this.isLoading = false;
      this.errorMessage = error.error.ResponseMsg;
    });
  }

  setNGOValidators() {
    const IsNGO = this.signupForm.controls.IsNGO.value;
    if (IsNGO) {
      this.signupForm.controls.RegisterationNo.setValidators([Validators.required]);
      this.signupForm.controls.Registeredat.setValidators([Validators.required]);
      this.signupForm.controls.cityName.setValidators([Validators.required]);
      this.signupForm.controls.stateName.setValidators([Validators.required]);
      this.signupForm.controls.countryName.setValidators([Validators.required]);
    } else {
      this.signupForm.controls.RegisterationNo.setValidators(null);
      this.signupForm.controls.Registeredat.setValidators(null);
      this.signupForm.controls.cityName.setValidators(null);
      this.signupForm.controls.stateName.setValidators(null);
      this.signupForm.controls.countryName.setValidators(null);

      this.signupForm.controls.RegisterationNo.setValue(null);
      this.signupForm.controls.Registeredat.setValue(null);
      this.signupForm.controls.cityName.setValue(null);
      this.signupForm.controls.stateName.setValue(null);
      this.signupForm.controls.countryName.setValue(null);
    }
    this.setCanEndorseValidators();
  }

  setCanEndorseValidators() {
    const CanEndorse = this.signupForm.controls.CanEndorse.value;
    if (CanEndorse) {
      this.signupForm.controls.NGOSector.setValidators([Validators.required]);
      this.signupForm.controls.NGOType.setValidators([Validators.required]);
    } else {
      this.signupForm.controls.NGOSector.setValidators(null);
      this.signupForm.controls.NGOType.setValidators(null);

      this.signupForm.controls.NGOSector.setValue(null);
      this.signupForm.controls.NGOType.setValue(null);
    }
    // this.signupForm.markAllAsTouched();
  }


  validateOtp() {
    if (this.otpForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.http.validateOTP(this.otpForm.value).subscribe((result: any) => {
      this.isLoading = false;
      this.errorMessage = '';
      this.doLogin();
    }, (error) => {
      this.isLoading = false;
      this.errorMessage = 'Invalid OTP. Please try again.';
    });
  }

  resendOtp() {
    this.isLoading = true;
    this.http.resendOTP(this.otpForm.controls.UserName.value).subscribe((result: any) => {
      this.isLoading = false;
      this.errorMessage = '';
    }, (error) => {
      this.isLoading = false;
      this.errorMessage = error.error.ResponseMsg;
    });
  }

  reloadCurrentRoute() {
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() =>
    this.router.navigate([location.pathname]));
  }

  doSocialLogin(user) {
    let payload = {};
    if (user.provider === 'GOOGLE') {
      payload = {
        userName: user.email,
        FirstName: user.firstName,
        LastName: user.lastName,
        DPPath: user.photoUrl,
        provider: user.provider,
        AId: user.id,
      };
    } else {
      payload = {
        userName: user.email,
        FirstName: user.firstName,
        LastName: user.lastName,
        DPPath: user.photoUrl,
        provider: user.provider,
        AId: user.id,
      };
    }
    this.isSubmitted = true;
    this.isLoading = true;
    this.http.socialLoginRequest(payload).subscribe((result: any) => {
      this.isLoading = false;
      this.setLoginSessionAndRouting(result, true);
      this.reloadCurrentRoute();
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
    if (this.data.option === 'create') {
      this.router.navigate(['/ce-fundraiser'], {queryParams: {c: 't'}});
    } else {
      this.router.navigate([`/accounts/${result.UserId}`]);
    }
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

  getNGOList() {
    forkJoin([this.http.getNGOSectors(), this.http.getNGOTypes()]).subscribe(responses => {
      this.ngoList = {
        ngoSectors: responses[0],
        ngoTypes: responses[1]
      };
    }, err => {
      this.ngoList = {
        ngoSectors: [],
        ngoTypes: []
      };
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
