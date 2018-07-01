import { NgModule } from '@angular/core';
import { FirstLetterPipe } from './first-letter/first-letter';
import {CapitalizePipe} from './capitalize/capitalize';
@NgModule({
  declarations: [
    FirstLetterPipe,
    CapitalizePipe
  ],
	imports: [],
  exports: [
    FirstLetterPipe,
    CapitalizePipe
  ]
})
export class PipesModule {}
