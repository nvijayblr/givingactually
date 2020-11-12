import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MaterialModule } from './modules/material.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { CategoryIconPipe } from './../services/categoryicon.pipe';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ImageCropperModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    CarouselModule,
    NgxDatatableModule
  ],
  declarations: [
    HeaderComponent,
    FooterComponent,
    LoginSignupComponent,
    ProgressBarComponent,
    ImageCropperComponent,
    ConfirmDialogComponent,
    CategoryIconPipe
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
    CarouselModule,
    CategoryIconPipe,
    NgxDatatableModule
  ],
  providers: [DatePipe],
  entryComponents: [
    LoginSignupComponent,
    ConfirmDialogComponent
  ]
})
export class SharedModule {}
