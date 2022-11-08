import { PlatformLocation } from '@angular/common';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  queryParams = inject(PlatformLocation).search;

  constructor() {
    if (this.queryParams.startsWith('?errorIn=AppComponentConstructor')) {
      setTimeout(() => {
        throw new Error(this.queryParams);
      }, 3000);
    }
  }

  ngOnInit() {
    if (this.queryParams.startsWith('?errorIn=AppComponentNgOnInit')) {
      setTimeout(() => {
        throw new Error(this.queryParams);
      }, 3000);
    }
  }
}
