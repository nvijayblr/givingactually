import { Pipe, PipeTransform } from '@angular/core';
import { CommonService } from './common.service';

@Pipe({
  name: 'categoryicon'
})
export class CategoryIconPipe implements PipeTransform {
  categories = [];
  constructor(private common: CommonService) {
    this.categories = this.common.categories;
  }

  transform(key: string): any {
    const category = this.categories.filter((cat) => cat.key === key);
    if (category.length) {
      return category[0].icon;
    }
    return 'fa-sticky-note';
  }
}
