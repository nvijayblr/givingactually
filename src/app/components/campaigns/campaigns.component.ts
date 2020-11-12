import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from '../../services/http-service.service';
import { ShareService } from 'ngx-sharebuttons';
import { Subscriber } from 'rxjs';
import { AuthGuardService } from '../../services/auth-guard.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { Title , Meta } from '@angular/platform-browser';

import * as moment from 'moment';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ShareService]
})
export class CampaignsComponent implements OnInit {

  @ViewChild('mainCarousel', {static: false}) mainCarousel;

  OwlOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    items: 1,
    nav: false,
    navText: []
  };

  OwlThumbnailOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    nav: false,
    center: true,
    margin: 10,
    navSpeed: 700,
    navText: ['', ''],
    items: 5
  };

  OwlCommentsOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    nav: false,
    navSpeed: 700,
    autoHeight: true,
    navText: ['', ''],
    items: 1,
  };
  selectedSlide = 0;

  isLoading = true;
  isReadMore = false;
  isLikesLoading = false;
  isSharesLoading = false;
  isEndorseLoading = false;
  isCommentLoading = false;

  campaignId: any = '';
  campaign: any = {
    campaignDescription: {},
    CampainOrganizer: {},
    CampaignDonationList: [],
    EndorsementsList: {},
    // Comments: [{
    //   Users: {}
    // }]
  };
  isCampaignError = false;
  selectedUpdatesTabIndex = 0;

  curComment = 1;
  userSession: any = {};
  isUserLoggedIn = false;
  isUserCanEndorse = false;

  isViewAllDonors = false;
  isViewAllEndorsements = false;

  commentsFormGroup: FormGroup;
  donationForm: FormGroup;
  isAdmin = false;
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpService,
    private authGuardService: AuthGuardService,
    public dialog: MatDialog,
    private router: Router,
    private meta: Meta ) {
    this.userSession = this.authGuardService.getLoggedInUserDetails();
    this.isUserLoggedIn = this.authGuardService.isUserLoggedIn();
    if (this.userSession && this.userSession.canEndorse === 'True') {
      this.isUserCanEndorse = true;
    }
  }

  ngOnInit() {
    this.isAdmin = this.authGuardService.isAdmin;
    this.commentsFormGroup = this.fb.group({
      CommentText: ['', [Validators.required, Validators.maxLength(1000)]]
    });
    this.campaignId = this.route.snapshot.params.campaignId;
    if (this.campaignId) {
      this.getCampaignDetails(this.campaignId);
    }
  }

  getCampaignDetails(campaignId) {
    this.isLoading = true;
    this.isCampaignError = false;
    this.http.cancelCompaignDetailsReq();
    this.http.getCompaignDetails(campaignId).subscribe((result: any) => {
      this.campaign = result ? result : {};
      this.isLoading = false;
      if (!this.campaign.Id) {
        this.router.navigate([`/home`]);
      }
      let desc = this.campaign.campaignDescription.StripedDescription;
      if (desc) {
        desc = desc.substring(0, 256).trim() + '...';
      }
      this.meta.updateTag({ name: 'title', content: this.campaign.CampaignTitle });
      this.meta.updateTag({ name: 'description', content: desc });
      this.meta.updateTag({ name: 'image', content: this.campaign.BDisplayPicPath });
      this.meta.updateTag({ name: 'author', content: this.campaign.OrganizerName });


      this.meta.updateTag({ property: 'og:title', content: this.campaign.CampaignTitle });
      this.meta.updateTag({ property: 'og:description', content: desc });
      this.meta.updateTag({ property: 'og:url', content: location.href });
      this.meta.updateTag({ property: 'og:image', content: this.campaign.BDisplayPicPath });

      this.meta.updateTag({ property: 'twitter:title', content: this.campaign.CampaignTitle });
      this.meta.updateTag({ property: 'twitter:description', content: desc });
      this.meta.updateTag({ property: 'twitter:url', content: location.href });
      this.meta.updateTag({ property: 'twitter:image:src', content: this.campaign.BDisplayPicPath });


    }, (error) => {
      // this.campaign = {};
      this.isCampaignError = true;
      this.isLoading = false;
      console.log(error.statusText);
    });
  }


  onCommentsChanges(event) {
    this.curComment = (event.startPosition + 1);
    console.log('eventeventevent...', event);
  }

  onReadMore() {
    this.isReadMore = !this.isReadMore;
  }

  likeCampaign(campaign) {
    const payload = {
      campaignId: campaign.Id
    };
    this.isLikesLoading = true;
    this.http.updateUserLike(payload).subscribe((result: any) => {
      this.isLikesLoading = false;
      campaign.IsSupportedByCtUser = true;
      this.campaign.LikeCount = result.LikesCount;
    }, (error) => {
      this.isLikesLoading = false;
      console.log(error.statusText);
    });
  }

  endorseCampaign(campaign) {
    const payload = {
      campaignId: campaign.Id
    };
    this.isEndorseLoading = true;
    this.http.updateUserEndorsement(payload).subscribe((result: any) => {
      console.log(result);
      this.isEndorseLoading = false;
      campaign.isCtNGOEndorsed = true;
      this.campaign.EndorsementsList.EndorseList.unshift(result);
    }, (error) => {
      this.isEndorseLoading = false;
      console.log(error.statusText);
    });
  }

  showEndorseConfirm() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Endorsement',
        message: 'Are you sure want to endorse this campaign?',
        cancelLable: 'No',
        okLable: 'Yes'
      }
    });

    dialogRef.afterClosed().subscribe(action => {
      if (action === 'ok') {
        this.endorseCampaign(this.campaign);
      }
    });

  }

  createShares(media) {
    const payload = {
      campaignId: this.campaign.Id,
      media,
    };
    this.isCommentLoading = true;
    this.http.updateUserShares(payload).subscribe((result: any) => {
      this.isCommentLoading = false;
      this.campaign.sharecount = this.campaign.sharecount + 1;
    }, (error) => {
      this.isCommentLoading = false;
      console.log(error.statusText);
    });
  }

  createComment() {
    const payload = {
      campaignId: this.campaign.Id,
      CommentText: this.commentsFormGroup.controls.CommentText.value,
      commentId: 0
    };
    this.isCommentLoading = true;
    this.http.updateUserComments(payload).subscribe((result: any) => {
      this.isCommentLoading = false;
      this.campaign.Comments.unshift(result);
      this.commentsFormGroup.controls.CommentText.setValue('');
      this.commentsFormGroup.reset();
    }, (error) => {
      this.isCommentLoading = false;
      console.log(error.statusText);
    });
  }

  updatesTabChange(tab) {
    console.log(tab.index);
    this.selectedUpdatesTabIndex = tab.index;
  }

  thumbnailClicked(index) {
    this.mainCarousel.to(`${index}`);
    this.selectedSlide = index;
  }

  toLocaleString(value) {
    if (value) {
      return value.toLocaleString();
    }
    return '0';
  }

  getFirstLetter(name) {
    if (name) {
      return name.substr(0, 1);
    }
    return '';
  }

  formatDate(date) {
    if (date) {
      return moment(date).format('DD, MMM YYYY');
    }
    return '';
  }

  formatTime(date) {
    if (date) {
      return moment(date).format('hh:mm A');
    }
    return '';
  }

}
