import { Component, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from '../../../../services/http-service.service';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-withdrawals-list',
  templateUrl: './withdrawals-list.component.html',
  styleUrls: ['./withdrawals-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WithdrawalsListComponent implements OnInit {
  @ViewChild(DatatableComponent, {static: false}) table: DatatableComponent;
  isLoading = true;
  action = '';
  ColumnMode = ColumnMode;
  withdrawalsList = [];
  temp = [];

  constructor(
    private http: HttpService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getWithdrawalsList();
  }

  getWithdrawalsList() {
    this.isLoading = true;
    this.withdrawalsList = [];
    this.http.cancelAdminWithdrawalsListReq();
    this.http.adminWithdrawalsListList().subscribe((result: any) => {
      this.withdrawalsList = result ? result : [];
      this.temp = this.withdrawalsList;
      this.isLoading = false;
    }, (error) => {
      this.withdrawalsList = [];
      this.isLoading = false;
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d) => {
      return d.CreatedBy.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.withdrawalsList = temp;
    this.table.offset = 0;
  }

  showWConfirm(data, action, index) {
    this.action = action;
    let msgObj = {
      title: 'Approve withdrawal request',
      msg: 'Are you sure want to approve the withdrawal request?',
      showReason: false
    };
    if (action === 'reject') {
      msgObj = {
        title: 'Reject withdrawal request',
        msg: 'Are you sure want to reject the withdrawal request?',
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
      WithdrawalId: data.WithdrawalId,
      RejectedReason: data.reasons ? data.reasons : undefined
    };
    this.http.approveRejectWithdrawalRequest(payload, action).subscribe((result: any) => {
      data.loading = false;
      // if (action === 'approve') {
      //   this.withdrawalsList.splice(index, 1);
      //   this.withdrawalsList = [...this.withdrawalsList];
      //   this.temp = this.withdrawalsList;
      // } else {
      //   data.RejectedReason = data.reasons;
      //   data.isRejected = true;
      // }
      this.getWithdrawalsList();
    }, (error) => {
    });
  }

}
