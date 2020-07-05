import { Injectable, Inject } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class CommonService  {

  public categories = [];
  constructor(
  ) { }

  public setCategories(categories) {
    this.categories = categories;
  }

}
