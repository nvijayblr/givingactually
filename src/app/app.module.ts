import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { AgmCoreModule } from '@agm/core';
import { ShareModule } from 'ngx-sharebuttons';

import { HttpService } from './services/http-service.service';
import { AuthGuardService } from './services/auth-guard.service';
import { MessageService } from './services/message.service';
import { HttpInterceptorService } from './services/http-interceptor.service';

import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { CampaignsComponent } from './components/campaigns/campaigns.component';
import { AboutusComponent } from './components/aboutus/aboutus.component';
import { ServicesComponent } from './components/services/services.component';
import { ContactusComponent } from './components/contactus/contactus.component';
import { FaqComponent } from './components/faq/faq.component';
import { HighlightsComponent } from './components/highlights/highlights.component';
import { CategoryComponent } from './components/category/category.component';

// Authorized components
import { AccountsComponent } from './components/authorized/accounts/accounts.component';
import { CreateCampaignComponent } from './components/authorized/create-campaign/create-campaign.component';
import { CampaignUpdatesComponent } from './components/authorized/campaign-updates/campaign-updates.component';
import { DonationComponent } from './components/authorized/donation/donation.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CampaignsComponent,
    AboutusComponent,
    ServicesComponent,
    ContactusComponent,
    FaqComponent,
    HighlightsComponent,
    CategoryComponent,
    AccountsComponent,
    CreateCampaignComponent,
    CampaignUpdatesComponent,
    DonationComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SocialLoginModule,
    CarouselModule,
    ShareModule.withConfig({
      debug: false
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBhcjuEadBRT5gygiNPVewKXxrnw88Eus0',
      libraries: ['places']
    }),
    SharedModule
  ],
  providers: [
    HttpService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
    AuthGuardService,
    MessageService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [{
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '604426761950-4p91h2avv8q5aj72r0um6poiv4a29m14.apps.googleusercontent.com'
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('894504637650396'),
          }
        ],
      } as SocialAuthServiceConfig,
    }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
