import { ensureElement } from '../../utils/utils'
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Card<T> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  
  constructor(container: HTMLElement, protected events?: IEvents) {
    super(container);
    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  } 

  set price(value: number | null) {
    if (value === null) {
      this.priceElement.textContent = 'Бесценно';
    } else {
      this.priceElement.textContent = `${value} синапсов`;
    }
  }
}