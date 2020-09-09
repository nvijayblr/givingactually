import { Injectable, Inject } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class CommonService  {

  public categories = [{
    title: 'All',
    icon: 'fa-globe',
    key: 'All',
    id: 'All'
  }, {
    title: 'Agriculture',
    icon: 'fa-tree',
    key: 'Agriculture',
    id: 'Agriculture'
  }, {
    title: 'Animals',
    icon: 'fa-paw',
    key: 'Animals',
    id: 'Animals'
  }, {
    title: 'Annadhanam',
    icon: 'fa-sun-o',
    key: 'Annadhanam',
    id: 'Annadhanam'
  }, {
    title: 'Charity',
    icon: 'fa-venus',
    key: 'Charity',
    id: 'Charity'
  }, {
    title: 'Education',
    icon: 'fa-book',
    key: 'Education',
    id: 'Education'
  }, {
    title: 'Elderly Care',
    icon: 'fa-blind',
    key: 'Elderly Care',
    id: 'ElderlyCare'
  }, {
    title: 'Emergency',
    icon: 'fa-ambulance',
    key: 'Emergency',
    id: 'Emergency'
  }, {
    title: 'Funeral',
    icon: 'fa-life-ring',
    key: 'Funeral',
    id: 'Funeral'
  }, {
    title: 'Medical',
    icon: 'fa-heartbeat',
    key: 'Medical',
    id: 'Medical'
  }, {
    title: 'Nutrition',
    icon: 'fa-cutlery',
    key: 'Nutrition',
    id: 'Nutrition'
  }, {
    title: 'Spirituality',
    icon: 'fa-circle-o-notch',
    key: 'Spirituality',
    id: 'Spirituality'
  }, {
    title: 'Sports',
    icon: 'fa-futbol-o',
    key: 'Sports',
    id: 'Sports'
  }, {
    title: 'Volunteer',
    icon: 'fa-handshake-o',
    key: 'Volunteer',
    id: 'Volunteer'
  }, {
    title: 'Others',
    icon: 'fa-sticky-note',
    key: 'Others',
    id: 'Others'
  }];
  constructor(
  ) { }

  public setCategories(categories) {
    this.categories = categories;
  }

}
