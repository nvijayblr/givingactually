import { Injectable, Inject } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class CommonService  {

  public categories = [1, 2, 3];
  constructor(
  ) { }

  public setCategories(categories) {
    this.categories = categories;
  }

}
