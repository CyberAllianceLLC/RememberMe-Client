/**
 * Created by smith on 5/15/2017.
 */
import { Storage } from '@ionic/storage';
import {Injectable} from "@angular/core";

@Injectable()
export class AppStorage {
  constructor(private storage: Storage){}

  set(id, data) {
    return new Promise((resolve, reject) => {
      if(typeof id !== 'string' || (typeof data !== 'object' && typeof data !== 'string')) {
        reject('Invalid storage parameters');
      }
      else if(typeof data === 'object') {
        this.storage.set(id, JSON.stringify(data)).then(() => {
          resolve();
        });
      }
      else {
        this.storage.set(id, data).then(() => {
          resolve();
        });
      }
    });
  }
  get(id) {
    return new Promise((resolve, reject) => {
      this.storage.get(id).then((data: any) => {
        let json;
        try {
          json = JSON.parse(data);
        } catch(error) {
          resolve(data);
        }
        resolve(json);
      });
    });
  }
}
