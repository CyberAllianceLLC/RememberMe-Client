import {Injectable} from '@angular/core';
import axios from "axios";
import {LocalStorageProvider} from "../local-storage/local-storage";

@Injectable()
export class HttpServiceProvider {

  private request: any;

  constructor(private storage: LocalStorageProvider) {
    // initialize request
    this.request = axios.create({
      baseURL: '/api',
      timeout: 4000
    });
  }

  /* Requests */

  //DONE: get <url>
  get(url: string) {
    return new Promise((resolve, reject) => {
      this.request.get(url).then((data: any) => {
        if (data.status === 200 && data.data.success) {
          resolve(data.data.response);
        } else {
          throw 'request failed';
        }
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  //DONE: post <url> <body>
  post(url: string, body: any, authToken: string = '') {
    return new Promise((resolve, reject) => {
      this.request.post(url, body, {headers: {'Authorization': `Bearer ${authToken}`}}).then((data: any) => {
        if (data.status === 200 && data.data.success) {
          resolve(data.data.response);
        } else {
          throw 'request failed';
        }
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  /* Auth */

  //DONE: addAuth <token>
  setAuth(refreshToken: string, authToken: string) {
    return new Promise((resolve, reject) => {
      this.storage.set('auth', {
        refreshToken: refreshToken,
        authToken: authToken
      }).then((data: any) => {
        resolve(data);
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  //DONE: getAuth
  getAuth() {
    return new Promise((resolve, reject) => {
      this.storage.get('auth').then((data: any) => {
        if ('authToken' in data) {
          resolve(data);
        } else {
          throw 'auth token not found';
        }
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

  //DONE: removeAuth
  removeAuth() {
    return new Promise((resolve, reject) => {
      this.storage.set('auth', {
        refreshToken: '',
        authToken: ''
      }).then(() => {
        resolve();
      }).catch((error: any) => {
        reject(error);
      });
    });
  }

}
