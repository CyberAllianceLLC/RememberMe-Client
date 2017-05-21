import { Component } from '@angular/core';

import { NotesPage } from '../Notes/Notes';
import { NamesPage } from '../Names/Names';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = NamesPage;
  tab2Root = NotesPage;

  constructor() {}
}
