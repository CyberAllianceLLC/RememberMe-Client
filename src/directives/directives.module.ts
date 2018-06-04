import { NgModule } from '@angular/core';
import { LocalStorageDirective } from './local-storage/local-storage';
import { NotificationDirective } from './notification/notification';
@NgModule({
	declarations: [
	  LocalStorageDirective,
    NotificationDirective
  ],
	imports: [],
	exports: [
	  LocalStorageDirective,
    NotificationDirective
  ]
})
export class DirectivesModule {}
