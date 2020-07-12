import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { HttpService } from '../../../services/http-service.service';
import { AuthGuardService } from '../../../services/auth-guard.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-campaign-updates',
  templateUrl: './campaign-updates.component.html',
  styleUrls: ['./campaign-updates.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CampaignUpdatesComponent implements OnInit, AfterViewInit {

  editorConfig: AngularEditorConfig = {
    editable: true,
    height: '250px',
    minHeight: '250px',
    maxHeight: '250px',
    toolbarHiddenButtons: [
      ['strikeThrough', 'subscript', 'superscript', 'justifyFull', 'indent', 'outdent', 'heading', 'fontName'],
      ['fontSize', 'textColor', 'backgroundColor', 'customClasses', 'insertImage', 'insertVideo', 'insertHorizontalRule',
      'toggleEditorMode']
    ],
    sanitize: true,
  };

  campaignDescriptionForm: FormGroup;

  user: any = {};
  isLoading = false;
  loaderMessage = 'Saving...';
  errorMessage = '';
  campaign: any = {
    CampainOrganizer: {} as any,
    campaignDescription: {} as any,
  };
  campaignId = '';

  croppedImage: any = '';
  galleryImgVideos = [{
    file: '',
    type: 'image'
  }];

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private common: CommonService,
    private authGuardService: AuthGuardService,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private location: Location ) {
    }

  ngOnInit() {
    this.user = this.authGuardService.getLoggedInUserDetails();
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams.id) {
        this.campaignId = queryParams.id;
        if (!this.campaign.Id) {
          // this.getCampaignDetails(queryParams.id);
        }
      }
    });

    this.user = this.authGuardService.getLoggedInUserDetails();
    this.initCampaignDescription(this.campaign);
  }

  ngAfterViewInit() {
  }


  // Campaign Updates
  initCampaignDescription(campaign) {
    this.campaignDescriptionForm = this.fb.group({
      StoryDescription: ['', Validators.required]
    });
    // this.galleryImgVideos.push({
    //   file: '',
    //   type: 'image'
    // });
  }

  campaignUpdatesSave() {
    if (!this.campaignDescriptionForm.valid || !this.campaignId) {
      return;
    }
    this.loaderMessage = 'Saving...';
    this.isLoading = true;
    this.http.updateCampaignUpdates(this.campaignId, this.campaignDescriptionForm.value).subscribe((result: any) => {
      this.isLoading = false;
      this.uploadGalleryImgVideos(result.UpdateId);
    }, (error) => {
      this.isLoading = false;
      this.errorMessage = error.error.ResponseMsg;
    });
  }

  uploadGalleryImgVideos(updateId) {
    this.loaderMessage = 'Uploading Images and Videos...';
    this.isLoading = true;

    let isUploadFound = false;
    const formData: any = new FormData();
    this.galleryImgVideos.map((imageVideo) => {
      if (imageVideo.file) {
        formData.append('file', imageVideo.file);
        isUploadFound = true;
      }
    });
    if (!isUploadFound) {
      return;
    }

    this.http.uploadCampaignUpdatesImagesVideos(this.campaignId, updateId, formData).subscribe((result: any) => {
      this.isLoading = false;
      this.router.navigate([`/accounts/${this.user.UserId}`]);
    }, (error) => {
      this.isLoading = false;
      this.errorMessage = error.error.ResponseMsg;
    });
  }

  galleryImageCroppedCompleted(cropped, index) {
    this.galleryImgVideos[index].file = cropped.file;
  }

  addImageToAttachments() {
    this.galleryImgVideos.push({
      file: '',
      type: 'image'
    });
  }

  deleteImageFromAttachments(index) {
    this.galleryImgVideos.splice(index, 1);
  }
  // End of the Campaign Updates

  // Get Campaign details
  getCampaignDetails(campaignId) {
    this.isLoading = true;
    this.loaderMessage = 'Loding details...';
    this.http.cancelCompaignDetailsReq();
    this.http.getCompaignDetails(campaignId).subscribe((result: any) => {
      this.campaign = result ? result : {};
      this.initCampaignDescription(this.campaign);
      this.isLoading = false;
    }, (error) => {
      this.campaign = {};
      this.isLoading = false;
      console.log(error.statusText);
    });
  }

  toLocaleString(value) {
    if (value) {
      return value.toLocaleString();
    }
    return '0';
  }


}


