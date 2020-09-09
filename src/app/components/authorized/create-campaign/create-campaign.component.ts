import { Component, OnInit, OnDestroy, AfterViewInit, ViewEncapsulation, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatStepper } from '@angular/material/stepper';
import { HttpService } from '../../../services/http-service.service';
import { AuthGuardService } from '../../../services/auth-guard.service';
import { CommonService } from '../../../services/common.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MessageService } from '../../../services/message.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { fakeAsync } from '@angular/core/testing';

@Component({
  selector: 'app-create-campaign',
  templateUrl: './create-campaign.component.html',
  styleUrls: ['./create-campaign.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CreateCampaignComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('search', {static: false})
  public searchElementRef: ElementRef;

  @ViewChild('stepper', {static: false}) stepper: MatStepper;
  @ViewChild('addresstext', {static: true}) addresstext: any;


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

  isCampaignBasicErr = false;
  isCampaignLocationErr = false;
  isCampaignDescriptionErr = false;
  locationErrMsg = '';

  beneficiaryList = [];
  currencyList = [];
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

  isCreateMode = false;

  croppedImage: any = '';
  galleryImgVideos = [{
    file: '',
    type: 'image',
    isOpenFile: false
  }];
  commonSub: Subscription;
  minDate = moment().format('YYYY-MM-DD');
  maxDate = moment(moment().add(6, 'months')).format('YYYY-MM-DD');
  currentLatLng: any = {};

  constructor(
    private fb: FormBuilder,
    private http: HttpService,
    private common: CommonService,
    private authGuardService: AuthGuardService,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone,
    private location: Location,
    private messageService: MessageService,
    public dialog: MatDialog ) {
      this.categories = this.common.categories;
    }

  ngOnInit() {
    this.user = this.authGuardService.getLoggedInUserDetails();
    this.categories = this.common.categories;
    // this.initDropdownData();
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams.c === 't') {
        this.isCreateMode = true;
      }
      if (queryParams.id) {
        this.campaignId = queryParams.id;
        this.stepperIndex = queryParams.step - 1;
        this.initEditCampaignDetails();
      }
    });

    this.commonSub = this.messageService.getCommonMessage().subscribe(message => {
      if (message.topic === 'categoryLoaded') {
        this.categories = this.common.categories;
      }
    });

    this.user = this.authGuardService.getLoggedInUserDetails();
    this.campaign.OrganizerName = this.user.DisplayName;
    this.initBasicDetails(this.campaign);
    this.initLocationDetails(this.campaign);
    this.initCampaignDescription(this.campaign);

    this.http.getGeoLocation().then(pos => {
      this.currentLatLng = pos;
    });

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.stepper.selectedIndex = this.stepperIndex;
    }, 100);
    this.getPlaceAutocomplete();
  }

  initEditCampaignDetails() {
    if (!this.campaign.Id) {
      this.getCampaignDetails(this.campaignId);
    }
  }

  initDropdownData() {
    this.isLoading = true;
    this.loaderMessage = 'Loding details...';
    if (!this.beneficiaryList.length || !this.currencyList.length) {
      forkJoin([this.http.getBeneficiaryType(), this.http.getMoneyType()]).subscribe(responses => {
        this.beneficiaryList = responses[0];
        this.currencyList = responses[0];
        this.initEditCampaignDetails();
      }, err => {
        this.beneficiaryList = [];
        this.currencyList = [];
        this.initEditCampaignDetails();
      });
    } else {
      this.initEditCampaignDetails();
    }
  }


  // Basic details - Phase 1
  initBasicDetails(campaign) {
    const targetDate = moment(moment().add(60, 'days')).format('YYYY-MM-DD');
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
      BGroupName: [campaign.BGroupName, [Validators.required]],
      CampaignTargetDate: [campaign.CampaignTargetDate ? campaign.CampaignTargetDate : targetDate, [Validators.required]]
    });
    this.updateDaysLeft();
  }

  basicNextClick(stepper: MatStepper) {
    const { CampaignTargetDate } = this.campaignBasicForm.value;
    this.isCampaignBasicErr = false;
    if (!this.campaignBasicForm.valid) {
      this.isCampaignBasicErr = true;
      return;
    }
    const payload = {
      ...this.campaignBasicForm.value,
      CampaignTargetDate: moment(CampaignTargetDate).format('YYYY-MM-DD')
    };

    this.loaderMessage = 'Saving...';
    // Update campaign
    if (this.campaignId) {
      this.isLoading = true;
      this.isLoading = true;
      this.http.updateCampaignBasic(this.campaignId, payload).subscribe((result: any) => {
        this.isLoading = false;
        this.location.go(`/ce-fundraiser?id=${this.campaignId}&step=2&c=${this.isCreateMode ? 't' : 'f'}`);
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
      this.location.go(`/ce-fundraiser?id=${this.campaignId}&step=2&c=${this.isCreateMode ? 't' : 'f'}`);
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
    this.campaign.placeName = campaign.CampainOrganizer.placeNmae;
    this.croppedImage = campaign.BDisplayPicPath;
  }

  displayImageCroppedCompleted(cropped) {
    this.croppedImage = cropped.image;
    this.displayImageFile = cropped.file;
  }

  locationNextClick(stepper: MatStepper) {
    const { placeName, Latitude, Longitude } = this.campaignLocationForm.value;
    if (placeName && (!Latitude && !Latitude)) {
      this.campaignLocationForm.controls.Latitude.setValue(this.currentLatLng.lat);
      this.campaignLocationForm.controls.Longitude.setValue(this.currentLatLng.lng);
    }
    this.isCampaignLocationErr = false;
    this.locationErrMsg = '';

    if (!this.campaignLocationForm.valid || !this.campaignId) {
      this.isCampaignLocationErr = true;
      return;
    }
    if (!this.displayImageFile && !this.campaign.BDisplayPicPath) {
      this.locationErrMsg = 'Fundraiser display picture is mandatory.';
      this.isCampaignLocationErr = true;
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
      this.location.go(`/ce-fundraiser?id=${this.campaignId}&step=3&c=${this.isCreateMode ? 't' : 'f'}`);
      stepper.next();
    }, (error) => {
      this.isLoading = false;
      this.errorMessage = error.error;
    });

  }

  // Campaign Location - Phase 3
  initCampaignDescription(campaign) {
    this.campaignDescriptionForm = this.fb.group({
      StoryDescription: [campaign.campaignDescription.StoryDescription,
        [Validators.required, Validators.minLength(500), Validators.maxLength(5000)]
      ]
    });
    this.galleryImgVideos = campaign.UploadedImages ? campaign.UploadedImages : [];
    if (!this.galleryImgVideos.length) {
      this.galleryImgVideos.push({
        file: '',
        type: 'image',
        isOpenFile: false
      });
    }
  }

  descriptionNextClick() {
    this.isCampaignDescriptionErr = false;
    if (!this.campaignDescriptionForm.valid || !this.campaignId) {
      this.isCampaignDescriptionErr = true;
      return;
    }
    this.loaderMessage = 'Saving...';
    this.isLoading = true;
    this.http.updateCampaignDescription(this.campaignId, this.campaignDescriptionForm.value).subscribe((result: any) => {
      this.isLoading = false;
      this.showCreateComplete();
      // this.router.navigate([`/accounts/${this.user.UserId}`]);
    }, (error) => {
      this.isLoading = false;
      this.errorMessage = error.error.ResponseMsg;
    });
  }

  uploadGalleryImgVideos() {
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

    this.loaderMessage = 'Uploading Images and Videos...';
    this.isLoading = true;

    this.http.uploadGalleryImagesVideos(this.campaignId, formData).subscribe((result: any) => {
      this.isLoading = false;
      this.descriptionNextClick();
    }, (error) => {
      this.isLoading = false;
      this.descriptionNextClick();
      this.errorMessage = error.error.ResponseMsg;
    });
  }

  showCreateComplete() {
    // Create campaing - show the register bank modal
    if (this.isCreateMode) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: 'Fundraiser creation is successful',
          // tslint:disable-next-line: max-line-length
          message: `To speed up the withdrawal process, please add beneficiary's bank account details now. Adding later may delay withdrawal process.`,
          cancelLable: 'Not now',
          okLable: 'Yes'
        }
      });

      dialogRef.afterClosed().subscribe(action => {
        if (action === 'ok') {
          this.router.navigate([`/bank-account`], {queryParams: {id: this.campaignId}});
        } else {
          this.router.navigate([`/fundraiser/${this.campaignId}`]);
        }
      });
    } else {
      this.showCampaignCompleteMsg('Fundraiser updation is successful.');
    }
  }

  showCampaignCompleteMsg(msg) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Completed',
        message: msg,
        cancelLable: '',
        okLable: 'OK'
      }
    });

    dialogRef.afterClosed().subscribe(action => {
      if (action === 'ok') {
        this.router.navigate([`/fundraiser/${this.campaignId}`]);
      } else {
        this.router.navigate([`/accounts/${this.user.UserId}`]);
      }
    });
  }

  galleryImageCroppedCompleted(cropped, index) {
    this.galleryImgVideos[index].file = cropped.file;
  }

  addImageToAttachments() {
    this.galleryImgVideos.push({
      file: '',
      type: 'image',
      isOpenFile: true
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

  updatePreview() {
    this.campaign = {
      ...this.campaign,
      ...this.campaignBasicForm.value,
      CategoryName: this.campaignBasicForm.value.CategoryType,
      CampainOrganizer: {
        placeNmae: this.campaignLocationForm.value.placeName
      },
      campaignDescription: {
        StripedDescription: this.campaignDescriptionForm.value.StoryDescription
      }
    };
  }

  updateDaysLeft() {
    if (this.campaignBasicForm.value.CampaignTargetDate) {
      const curDate = moment();
      const selectedDate = moment(this.campaignBasicForm.value.CampaignTargetDate);
      this.campaign.DaysLeft = selectedDate.diff(curDate, 'days') + 1;
    }
  }

  // Map related functions
  private getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(this.addresstext.nativeElement, {
        types: ['geocode']  // 'establishment' / 'address' / 'geocode'
    });
    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const place = autocomplete.getPlace();
      this.setAddressAndLatLng(place);
    });
  }

  setAddressAndLatLng(place: any) {
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    this.campaignLocationForm.controls.Latitude.setValue(lat);
    this.campaignLocationForm.controls.Longitude.setValue(lng);
    this.campaignLocationForm.controls.placeName.setValue(place.formatted_address);
    this.campaign.placeName = place.name;
  }

  getFirstLetter(name) {
    if (name) {
      return name.substr(0, 1);
    }
    return '';
  }

  ngOnDestroy() {
    this.commonSub.unsubscribe();
  }

}
