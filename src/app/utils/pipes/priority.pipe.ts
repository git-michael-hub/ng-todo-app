import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priority',
  standalone: true
})
export class PriorityPipe implements PipeTransform {

  transform(value: 'low' | 'medium' | 'high', withIcon?: boolean): string {
    switch (value) {
      case 'low': return '';
      case 'medium': return '⚠️';
      case 'high': return '❗️';
    }
  }

}
