import { Pipe, PipeTransform } from '@angular/core';
import _ from 'lodash';
@Pipe({
  name: 'firstLetter',
})
export class FirstLetterPipe implements PipeTransform {
  transform(value: string, ...args) {
    return _.toUpper(_.head(value));
  }
}
