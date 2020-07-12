import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  categories: any = [];
  categoriesFirstFive: any = [];
  categoriesSecondFive: any = [];
  constructor(public common: CommonService, ) { }

  ngOnInit() {
    this.categories = this.common.categories;
    if (this.categories && this.categories.length) {
      this.categoriesFirstFive = JSON.parse(JSON.stringify(this.common.categories)).splice(0, 5);
      this.categoriesSecondFive = JSON.parse(JSON.stringify(this.common.categories)).splice(5, 5);
    }
  }

}
