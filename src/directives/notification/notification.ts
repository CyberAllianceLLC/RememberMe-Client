import { Directive } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

@Directive({
  selector: '[notification]'
})
export class NotificationDirective {

  private notification = new Subject<any>();

  sendNotification(body: any) {
    this.notification.next(body);
  }

  getNotification(): Observable<any> {
    return this.notification.asObservable();
  }

}
