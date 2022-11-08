import { PlatformLocation } from '@angular/common';
import { APP_INITIALIZER, inject, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { delay, map, of } from 'rxjs';

import { AppComponent } from './app.component';
import { ChildComponent } from './child.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    RouterModule.forRoot([{ path: '', component: ChildComponent }]),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const queryParams = inject(PlatformLocation).search;
        return () => {
          if (queryParams.startsWith('?errorIn=ObservableAppInitializer')) {
            return of(null).pipe(
              delay(3000),
              map(() => {
                throw new Error(queryParams);
              })
            );
          }
          return of(null);
        };
      },
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const queryParams = inject(PlatformLocation).search;
        return () =>
          new Promise((resolve, reject) => {
            if (queryParams.startsWith('?errorIn=PromiseAppInitializer')) {
              setTimeout(() => {
                reject(new Error(queryParams));
              }, 3000);
            } else {
              resolve(null);
            }
          });
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
