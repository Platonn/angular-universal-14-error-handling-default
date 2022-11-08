import { PlatformLocation } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'child-component',
  template: '<h2>Child Component works</h2>',
})
export class ChildComponent {
  queryParams = inject(PlatformLocation).search;

  constructor() {
    if (this.queryParams.startsWith('?errorIn=ChildComponentConstructor')) {
      setTimeout(() => {
        throw new Error(this.queryParams);
      }, 3000);
    }
  }

  ngOnInit() {
    if (this.queryParams.startsWith('?errorIn=ChildComponentNgOnInit')) {
      setTimeout(() => {
        throw new Error(this.queryParams);
      }, 3000);
    }
  }
}
