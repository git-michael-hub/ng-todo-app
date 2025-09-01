import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import * as _ from 'lodash';

@Directive({
  selector: '[showHide]',
  standalone: true
})
export class ShowHideDirective {

  @Input() shtClasses!: string;
  @Input() set shtDefault(isShown: boolean | undefined ) {
    if (isShown === undefined) return;
    this.toggle(isShown);
   }

  private parent!: HTMLElement;
  private span: HTMLSpanElement = document.createElement('span');
  private isShown = false;

  private forbiddenTextIcon = `
    <i name="forbidden-text" class="fa-solid fa-eye-slash h-5 w-5 text-gray-600 text-lg flex items-center"></i>
  `;

  private showTextIcon = `
    <i name="show-text" class="fa-solid fa-eye h-5 w-5 text-gray-600 text-lg flex items-center"></i>
  `;

  constructor(private hostElement: ElementRef) {
    this.parent = this.hostElement.nativeElement.parentNode;

    // add tailwind classes to span
    ['inline-flex', 'items-center', 'px-1', 'cursor-pointer', 'select-none']
      .forEach((item) => this.span.classList.add(item));

    // display default icon
    this.span.innerHTML = this.forbiddenTextIcon;

    // set name
    this.span.setAttribute('name', 'span-wrapper');

    // event trigger
    this.span.addEventListener('click', () => this.toggle());

    // add span
    this.parent.appendChild(this.span);
   }

   ngOnChanges(): void {
    if (this.shtClasses) {
      const classes = _.filter(this.shtClasses.split(' '), _class => _class) as string[];
      classes.forEach((item) => this.span.classList.add(item));
    }
   }

   toggle(isShown: boolean | null = null): void {

    if (isShown === null)
      this.isShown = !this.isShown;
    else this.isShown = isShown;

    if (this.isShown) {
      this.hostElement.nativeElement.setAttribute('type', 'text');
      this.span.innerHTML = this.showTextIcon;
    }
    else {
      this.hostElement.nativeElement.setAttribute('type', 'password');
      this.span.innerHTML = this.forbiddenTextIcon;
    }
  }
}
