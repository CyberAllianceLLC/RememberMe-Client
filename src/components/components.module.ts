import { NgModule } from '@angular/core';
import { EditNameComponent } from './edit-name/edit-name';
import { EditNoteComponent } from './edit-note/edit-note';
@NgModule({
	declarations: [EditNameComponent,
    EditNoteComponent],
	imports: [],
	exports: [EditNameComponent,
    EditNoteComponent]
})
export class ComponentsModule {}
