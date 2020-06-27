import { Component, OnInit } from '@angular/core';
import { RouterOutlet, ActivatedRoute } from '@angular/router';
import { HttpService } from './services/http-service.service';
import { CommonService } from './services/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  isLoading = false;

  constructor(private route: ActivatedRoute, private http: HttpService, public common: CommonService) {
  }

  ngOnInit() {
    this.initCategories();
  }

  initCategories() {
    this.isLoading = false;
    this.http.getCategories().subscribe((result: any) => {
      console.log(result);
      this.common.setCategories(result ? result : []);
      this.isLoading = true;
    }, (error) => {
      this.common.categories = [];
      this.isLoading = true;
    });
  }

}
