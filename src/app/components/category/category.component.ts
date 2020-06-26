import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpServiceService } from '../../services/http-service.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoryComponent implements OnInit {

  categoryName: any = '';

  constructor(private route: ActivatedRoute, private http: HttpServiceService) { }

  ngOnInit() {
    this.categoryName = this.route.snapshot.params.categoryId;
  }

}
