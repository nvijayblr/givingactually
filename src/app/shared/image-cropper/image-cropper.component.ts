import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;

  @Input() isOpenFile = false;
  @Input() label = 'Select Image';
  @Input() preview = '';
  @Input() aspectRatio = 600/315;
  @Input() resizedWidth = 600;
  @Input() resizedHeight = 315;
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
    if (this.isOpenFile) {
      console.log(this.fileInput);
      const fileElement: HTMLElement = this.fileInput.nativeElement;
      fileElement.click();
    }
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
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      if (file.type.indexOf('video') >= 0) {
        this.imageCroppedCompleted.emit({
          image: '',
          file,
          type: 'video'
        });
      }
    }
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.imageCroppedCompleted.emit({
      image: event.base64,
      file: base64ToFile(event.base64),
      type: 'image'
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
