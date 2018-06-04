import { NgModule } from '@angular/core';
import { FirstLetterPipe } from './first-letter/first-letter';
@NgModule({
	declarations: [FirstLetterPipe],
	imports: [],
	exports: [FirstLetterPipe]
})
export class PipesModule {}
