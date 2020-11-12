import { Component, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from '../../../../services/http-service.service';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersListComponent implements OnInit {
  @ViewChild(DatatableComponent, {static: false}) table: DatatableComponent;
  isLoading = true;
  action = '';
  ColumnMode = ColumnMode;
  users = [];
  temp = [];

  constructor(
    private http: HttpService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getUsersList();
  }

  getUsersList() {
    this.isLoading = true;
    this.users = [];
    this.http.cancelAdminUsersListReq();
    this.http.adminGetUsersList().subscribe((result: any) => {
      this.users = result ? result.UserLists : [];
      this.temp = this.users;
      this.isLoading = false;
    }, (error) => {
      this.users = [];
      this.isLoading = false;
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter((d) => {
      return d.UserName.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.users = temp;
    this.table.offset = 0;
  }

  showWConfirm(action, index) {
    this.action = action;
    let msgObj = {
      title: 'Lock account',
      msg: 'Are you sure want to lock the account?'
    };
    if (action === 'unlock') {
      msgObj = {
        title: 'Unlock account',
        msg: 'Are you sure want to unlock the account?'
      };
    }
    if (action === 'delete') {
      msgObj = {
        title: 'Delete account',
        msg: 'Are you sure want to delete the account?'
      };
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: msgObj.title,
        message: msgObj.msg,
        cancelLable: 'Cancel',
        okLable: 'Yes'
      }
    });

    dialogRef.afterClosed().subscribe(option => {
      if (option === 'ok') {
        this.submitAction(action, index);
      } else {
      }
    });
  }

  submitAction(action, index) {
    if (action === 'lock' || action === 'unlock') {
      this.users[index].actionLoading = true;
      this.http.adminGetUsersList().subscribe((result: any) => {
        this.users[index].IsAcLocked = true;
        this.users[index].actionLoading = false;
      }, (error) => {
        this.users[index].actionLoading = false;
      });
      return;
    }
    if (action === 'delete') {
      this.users[index].actionLoading = true;
      this.http.adminGetUsersList().subscribe((result: any) => {
        this.users[index].actionLoading = false;
        this.users.splice(index, 1);
      }, (error) => {
        this.users[index].actionLoading = false;
      });
      return;
    }
  }

}

