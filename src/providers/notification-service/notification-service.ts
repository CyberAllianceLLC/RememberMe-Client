import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class NotificationServiceProvider {

  private notification = new Subject<any>();

  sendNotification(body: any) {
    this.notification.next(body);
  }

  getNotification(): Observable<any> {
    return this.notification.asObservable();
  }

}
