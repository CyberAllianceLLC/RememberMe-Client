import { Directive } from '@angular/core';

@Directive({
  selector: '[local-storage]' // Attribute selector
})
export class LocalStorageDirective {

  get(key: string) {
    return new Promise((resolve, reject) => {
      let value: any;
      try {
        value = JSON.parse(window.localStorage.getItem(key));
      } catch (error) {
        reject('Unable to get values from local storage.');
      }
      resolve(value);
    });
  }

  set(key: string, value = {}) {
    return new Promise((resolve, reject) => {
      if (!key) { reject('Unable to add values to local storage'); }
      window.localStorage.setItem(key, JSON.stringify(value));
      resolve(value);
    });
  }

  clear() {
    return new Promise((resolve, reject) => {
      try {
        window.localStorage.clear();
      } catch (error) {
        reject('Unable to clear values from local storage.');
      }
      resolve();
    });
  }
}
