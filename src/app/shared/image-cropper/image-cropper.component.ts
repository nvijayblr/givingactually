import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { base64ToFile } from 'ngx-image-cropper';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class ImageCropperComponent implements OnInit {

  @Input() label = 'Select Image';
  @Output() imageCroppedCompleted = new EventEmitter<any>();

  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};

  constructor() { }

  ngOnInit() {
  }

  deleteImage() {
    this.croppedImage = '';
    this.imageChangedEvent = '';
    this.imageCroppedCompleted.emit({
      image: '',
      file: ''
    });
  }
  handleFileInput(files) {
    console.log(files);
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.imageCroppedCompleted.emit({
      image: event.base64,
      file: base64ToFile(event.base64)
    });
  }

  imageLoaded() {
    this.showCropper = true;
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
      console.log('Load failed');
  }

}
