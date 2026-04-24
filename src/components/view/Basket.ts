import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IBasketData {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasketData> {
  protected listElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.priceElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.buttonElement.addEventListener('click', () => {
      this.events.emit('basket:checkout');
    });

    this.buttonElement.disabled = true;
  }

  set items(items: HTMLElement[]) {
    this.listElement.innerHTML = '';
    if (items.length === 0) {
      this.buttonElement.disabled = true;
    } else {
      items.forEach(item => {
        this.listElement.appendChild(item);
        this.buttonElement.disabled = false;
      });
    }
  }

  set total(value: number) {
    this.priceElement.textContent = `${value} синапсов`;
  }
}