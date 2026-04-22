import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface ISuccessData {
  total: number;
}

export class Succsess extends Component<ISuccessData> {
  protected descriptionElement: HTMLElement;
  protected orderSuccessClose: HTMLButtonElement;

  constructor(container: HTMLElement, protected event: IEvents) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>('.order-success__description', this.container);
    this.orderSuccessClose = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

    this.orderSuccessClose.addEventListener('click', () => {
      this.event.emit('success:close');
    });
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}