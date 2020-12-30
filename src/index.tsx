import './styles/global.scss';
import { App } from './app.component';
import { SW_ACTIVE, WEB_URI } from './env/environment';
import { VersionModel } from './models/version-model';
import HttpClient from './services/http.service';
import { SW_FILE_NAME, SW_VERSION_NAME } from './settings';

import React from 'react';

import { render } from 'react-dom';
import { from, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

if ('serviceWorker' in navigator && !!SW_ACTIVE) {
  window.addEventListener('load', () => {
    const currentVersion = localStorage.getItem('version');
    let featureVersion = '';
    HttpClient.Build(WEB_URI).getRequest(SW_VERSION_NAME)
      .pipe(
        mergeMap((data: VersionModel) => {
          featureVersion = data.version;
          if (currentVersion !== featureVersion) {
            localStorage.setItem('version', featureVersion);
            return from(navigator.serviceWorker.getRegistrations());
          }
          return of(null);
        }),
        mergeMap((items?: ServiceWorkerRegistration[]) => {
          if (items) {
            items.forEach((item) => {
              item.unregister();
            });
          }
          return of(true);
        }),
        catchError(() => of(false)),
      )
      .subscribe((data: boolean) => {
        if (data && currentVersion !== featureVersion) {
          navigator.serviceWorker.register(`${WEB_URI}${SW_FILE_NAME}`).then();
        }
      });
  });
}

render(
  <App />,
  document.getElementById('app'),
);
