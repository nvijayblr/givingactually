import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {

  categories: any = [];
  categoriesFirstFive: any = [];
  categoriesSecondFive: any = [];
  commonSub: Subscription;
  isAdmin = false;
  isAdminPage = false;

  constructor(public common: CommonService, private messageService: MessageService) { }

  ngOnInit() {
    this.categories = this.common.categories;
    if (this.categories && this.categories.length) {
      this.categoriesFirstFive = JSON.parse(JSON.stringify(this.common.categories)).splice(0, 5);
      this.categoriesSecondFive = JSON.parse(JSON.stringify(this.common.categories)).splice(5, 5);
    }

    this.commonSub = this.messageService.getCommonMessage().subscribe(message => {
      if (message.topic === 'categoryLoaded') {
        this.categories = this.common.categories;
        if (this.categories && this.categories.length) {
          this.categoriesFirstFive = JSON.parse(JSON.stringify(this.common.categories)).splice(0, 5);
          this.categoriesSecondFive = JSON.parse(JSON.stringify(this.common.categories)).splice(5, 5);
        }
      }
      if (message.topic === 'adminPage') {
        this.isAdminPage = message.isAdminPage;
      }
    });
  }

  ngOnDestroy() {
    this.commonSub.unsubscribe();
  }

}
