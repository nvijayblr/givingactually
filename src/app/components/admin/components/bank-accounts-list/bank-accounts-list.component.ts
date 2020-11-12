import { Component, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from '../../../../services/http-service.service';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-bank-accounts-list',
  templateUrl: './bank-accounts-list.component.html',
  styleUrls: ['./bank-accounts-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BankAccountsListComponent implements OnInit {
  @ViewChild(DatatableComponent, {static: false}) table: DatatableComponent;
  isLoading = true;
  action = '';
  ColumnMode = ColumnMode;
  bankAccounts = [];
  temp = [];

  constructor(
    private http: HttpService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getBankAccountList();
  }

  getBankAccountList() {
    this.isLoading = true;
    this.bankAccounts = [];
    this.http.cancelAdminBankAccountsListReq();
    this.http.adminBankAccountsList().subscribe((result: any) => {
      this.bankAccounts = result ? result : [];
      this.temp = this.bankAccounts;
      this.isLoading = false;
    }, (error) => {
      this.bankAccounts = [];
      this.isLoading = false;
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d) => {
      return d.BenName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.bankAccounts = temp;
    this.table.offset = 0;
  }

  showWConfirm(data, action, index) {
    this.action = action;
    let msgObj = {
      title: 'Approve account',
      msg: 'Are you sure want to approve the  bank account?',
      showReason: false
    };
    if (action === 'reject') {
      msgObj = {
        title: 'Reject account',
        msg: 'Are you sure want to reject the bank account?',
        showReason: true
      };
    }
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: msgObj.title,
        message: msgObj.msg,
        cancelLable: 'Cancel',
        okLable: 'Yes',
        showReason: msgObj.showReason
      }
    });

    dialogRef.afterClosed().subscribe(option => {
      if (option === 'ok') {
        this.submitAction(data, action, index);
      } else if (option.action === 'ok') {
        data.reasons = option.reasons;
        this.submitAction(data, action, index);

      }
    });
  }

  submitAction(data, action, index) {
    data.loading = true;
    const payload = {
      BankId: data.BankId,
      CampaignId: data.CampaignId,
      RejectedReason: data.reasons ? data.reasons : undefined
    };
    this.http.approveRejectBankAccount(payload, action).subscribe((result: any) => {
      data.loading = false;
      if (action === 'approve') {
        this.bankAccounts.splice(index, 1);
        this.bankAccounts = [...this.bankAccounts];
        this.temp = this.bankAccounts;
      } else {
        data.RejectedReason = data.reasons;
        data.isRejected = true;
      }
    }, (error) => {
    });
  }

}

