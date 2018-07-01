import {Pipe, PipeTransform} from '@angular/core';
import _ from 'lodash';

@Pipe({
  name: 'capitalize',
})
export class CapitalizePipe implements PipeTransform {
  transform(value: string, ...args) {
    return _.capitalize(value);
  }
}
