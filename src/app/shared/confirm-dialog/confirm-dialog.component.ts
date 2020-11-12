import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  reasons = '';
  showReason  = false;

  constructor(
    public dialog: MatDialogRef<ConfirmDialogComponent>,
    private ngZone: NgZone,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.showReason = data.showReason;
    this.dialog.disableClose = true;
  }

  ngOnInit() {
  }

  onCloseDialog(action) {
    this.ngZone.run(() => {
      if (this.showReason) {
        this.dialog.close({action, reasons: this.reasons});
      } else {
        this.dialog.close(action);
      }
    });
  }

}
