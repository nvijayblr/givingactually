import { Component, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from '../../../../services/http-service.service';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-campaigns-list',
  templateUrl: './campaigns-list.component.html',
  styleUrls: ['./campaigns-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CampaignsListComponent implements OnInit {
  @ViewChild(DatatableComponent, {static: false}) table: DatatableComponent;
  isLoading = true;
  ColumnMode = ColumnMode;
  columnsDefs = [
    { prop: 'CampaignTitle' },
    { prop: 'CategoryName' },
    { prop: 'OrganizerName' },
    { prop: 'CampaignTargetMoney' },
    { prop: 'RaisedAmount' },
    { prop: 'CampaignTargetDate' },
    { prop: 'placeName' },
  ];
  type = 'GetAdminCampaigns';
  campaigns = [];
  temp = [];
  showButtons = false;

  constructor(
    private http: HttpService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getCampaignsList();
  }

  getCampaignsList() {
    this.isLoading = true;
    this.campaigns = [];
    this.showButtons = false;
    if (this.type === 'GetUnApprovalCampaigns') {
      this.showButtons = true;
    }
    this.http.cancelAdminCompaignsListReq();
    this.http.adminGetCampaigns(this.type).subscribe((result: any) => {
      this.campaigns = result ? result.CampaignLists : [];
      this.temp = this.campaigns;
      this.isLoading = false;
    }, (error) => {
      this.campaigns = [];
      this.isLoading = false;
    });
  }

  approveCampaigns(data, index) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Approve',
        message: 'Are you sure want to approve the fundraiser?',
        cancelLable: 'Cancel',
        okLable: 'Yes'
      }
    });

    dialogRef.afterClosed().subscribe(option => {
      if (option === 'ok') {
        data.loading = true;
        this.http.approveCampaign(data.Id).subscribe((result: any) => {
          this.campaigns.splice(index, 1);
          this.campaigns = [...this.campaigns];
          this.temp = this.campaigns;
          }, (error) => {
        });
      } else {
      }
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d) => {
      return d.CampaignTitle.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.campaigns = temp;
    this.table.offset = 0;
  }

  campaignsTypeChange($event) {
    setTimeout(() => {
      this.getCampaignsList();
    }, 100);
  }

}
