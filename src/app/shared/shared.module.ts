import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MaterialModule } from './modules/material.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ImageCropperModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CarouselModule
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    LoginSignupComponent,
    ProgressBarComponent,
    ImageCropperComponent,
    ConfirmDialogComponent,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    ImageCropperModule,
    HeaderComponent,
    FooterComponent,
    LoginSignupComponent,
    ProgressBarComponent,
    ImageCropperComponent,
    ConfirmDialogComponent,
    CarouselModule
  ],
  providers: [DatePipe],
  entryComponents: [
    LoginSignupComponent,
    ConfirmDialogComponent
  ]
})
export class SharedModule {}
