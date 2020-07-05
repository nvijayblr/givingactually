import { Component, OnInit, AfterViewInit, ViewEncapsulation, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { MatStepper } from '@angular/material/stepper';
import { HttpService } from '../../../services/http-service.service';
import { AuthGuardService } from '../../../services/auth-guard.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CreateCampaignComponent implements OnInit, AfterViewInit {
  @ViewChild('search', {static: false})
  public searchElementRef: ElementRef;

  @ViewChild('stepper', {static: false}) stepper: MatStepper;


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

  campaignBasicForm: FormGroup;
  campaignLocationForm: FormGroup;
  campaignDescriptionForm: FormGroup;

  categories: any = [];
  user: any = {};
  isLoading = false;
  loaderMessage = 'Saving...';
  errorMessage = '';
  campaign: any = {
    CampainOrganizer: {} as any,
    campaignDescription: {} as any,
  };
  campaignId = '';
  stepperIndex = 0;
  displayImageFile: any;

  geoCoder: any;
  latitude: number;
  longitude: number;
  address: string;
  zoom: number;

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
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private location: Location ) {
      this.categories = this.common.categories;
    }

  ngOnInit() {
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams.id) {
        this.campaignId = queryParams.id;
        this.stepperIndex = queryParams.step - 1;
        if (!this.campaign.Id) {
          this.getCampaignDetails(queryParams.id);
        }
      }
    });

    this.user = this.authGuardService.getUserLogin();
    this.initBasicDetails(this.campaign);
    this.initLocationDetails(this.campaign);
    this.initCampaignDescription(this.campaign);

    this.initGoogleMap();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.stepper.selectedIndex = this.stepperIndex;
    }, 100);
  }


  // Basic details - Phase 1
  initBasicDetails(campaign) {
    this.campaignBasicForm = this.fb.group({
      CampaignTitle: [campaign.CampaignTitle, [Validators.required, Validators.maxLength(50)]],
      CategoryType: [campaign.CategoryName, [Validators.required]],
      CampaignTargetMoneyType: [
        campaign.CampaignTargetMoneyType ? campaign.CampaignTargetMoneyType : 'INR',
        [Validators.required]
      ],
      CampaignTargetMoney: [campaign.CampaignTargetMoney, [Validators.required, Validators.min(2000), Validators.maxLength(10000000)]],
      BeneficiaryType: [
        campaign.BeneficiaryType ? campaign.BeneficiaryType : 'Myself',
        [Validators.required]
      ],
      BGroupName: [campaign.BGroupName, [Validators.required]]
    });
  }

  basicNextClick(stepper: MatStepper) {
    if (!this.campaignBasicForm.valid) {
      return;
    }
    this.loaderMessage = 'Saving...';
    // Update campaign
    if (this.campaignId) {
      this.isLoading = true;
      this.isLoading = true;
      this.http.updateCampaignBasic(this.campaignId, this.campaignBasicForm.value).subscribe((result: any) => {
        this.isLoading = false;
        this.location.go(`/create-campaign?id=${this.campaignId}&step=2`);
        stepper.next();
      }, (error) => {
        this.isLoading = false;
        this.errorMessage = error.error;
      });
      return;
    }

    // Create new campaign
    this.isLoading = true;
    this.http.createCampaignBasic(this.campaignBasicForm.value).subscribe((result: any) => {
      this.isLoading = false;
      this.campaignId = result.campaignId;
      this.location.go(`/create-campaign?id=${this.campaignId}&step=2`);
      this.stepper.next();
    }, (error) => {
      this.isLoading = false;
      this.errorMessage = error.error;
    });
  }


  // Campaign Location - Phase 2
  initLocationDetails(campaign) {
    this.campaignLocationForm = this.fb.group({
      placeName: [campaign.CampainOrganizer.placeNmae, Validators.required],
      Latitude: [campaign.Latitude, Validators.required],
      Longitude: [campaign.Longitude, Validators.required],
    });
    this.croppedImage = campaign.BDisplayPicPath;
  }

  displayImageCroppedCompleted(cropped) {
    this.croppedImage = cropped.image;
    this.displayImageFile = cropped.file;
  }

  locationNextClick(stepper: MatStepper) {
    if (!this.campaignLocationForm.valid || !this.campaignId) {
      return;
    }
    this.loaderMessage = 'Saving...';
    let formData: any = new FormData();
    if (this.displayImageFile) {
      formData.append('file', this.displayImageFile);
    } else {
      formData = {};
    }

    this.isLoading = true;
    this.http.updateCampaignLocation(this.campaignId, this.campaignLocationForm.value, formData).subscribe((result: any) => {
      this.isLoading = false;
      this.displayImageFile = '';
      this.location.go(`/create-campaign?id=${this.campaignId}&step=3`);
      stepper.next();
    }, (error) => {
      this.isLoading = false;
      this.errorMessage = error.error;
    });

  }

  // Campaign Location - Phase 3
  initCampaignDescription(campaign) {
    this.campaignDescriptionForm = this.fb.group({
      StoryDescription: [campaign.campaignDescription.StoryDescription, Validators.required]
    });
    this.galleryImgVideos = campaign.UploadedImages ? campaign.UploadedImages : [];
    console.log(this.galleryImgVideos);
  }

  descriptionNextClick() {
    if (!this.campaignDescriptionForm.valid || !this.campaignId) {
      return;
    }
    this.loaderMessage = 'Saving...';
    this.isLoading = true;
    this.http.updateCampaignDescription(this.campaignId, this.campaignDescriptionForm.value).subscribe((result: any) => {
      this.isLoading = false;
      this.router.navigate([`/accounts/${this.user.UserId}`]);
    }, (error) => {
      this.isLoading = false;
      this.errorMessage = error.error.ResponseMsg;
    });
  }

  uploadGalleryImgVideos() {
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
      this.descriptionNextClick();
      return;
    }

    this.http.uploadGalleryImagesVideos(this.campaignId, formData).subscribe((result: any) => {
      this.isLoading = false;
      this.descriptionNextClick();
    }, (error) => {
      this.isLoading = false;
      this.descriptionNextClick();
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
  // End of the Phase 3

  toLocaleString(value) {
    if (value) {
      return value.toLocaleString();
    }
    return '0';
  }

  // Get Campaign details
  getCampaignDetails(campaignId) {
    this.isLoading = true;
    this.loaderMessage = 'Loding details...';
    this.http.cancelCompaignDetailsReq();
    this.http.getCompaignDetails(campaignId).subscribe((result: any) => {
      this.campaign = result ? result : {};
      this.initBasicDetails(this.campaign);
      this.initLocationDetails(this.campaign);
      this.initCampaignDescription(this.campaign);
      this.isLoading = false;
    }, (error) => {
      this.campaign = {};
      this.isLoading = false;
      console.log(error.statusText);
    });
  }

  setStepperIndex(event) {
    console.log(event);
  }

  // Map related functions

  initGoogleMap() {
    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder();

      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.zoom = 12;
        });
      });
    });
  }

  setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.campaignLocationForm.controls.Latitude.setValue(this.latitude);
        this.campaignLocationForm.controls.Longitude.setValue(this.longitude);
        this.zoom = 15;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          console.log('No results found');
        }
      } else {
        console.log('Geocoder failed due to: ' + status);
      }
    });
  }

  markerDragEnd(event) {
    const { lat, lng } = event.coords;
    this.campaignLocationForm.controls.Latitude.setValue(lat);
    this.campaignLocationForm.controls.Longitude.setValue(lng);
  }

}
