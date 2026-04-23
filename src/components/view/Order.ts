import { IOrder } from '../../types/index'
import { ensureElement } from '../../utils/utils'
import { IEvents } from '../base/Events';
import { Form } from './Form';

export type IOrderForm = Pick<IOrder, 'payment' | 'address'>;

export class Order extends Form<IOrderForm> {
  protected cardButtonElement: HTMLButtonElement;
  protected cashButtonElement: HTMLButtonElement;
  protected addressInput: HTMLInputElement;
  protected nextButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events)

    this.cardButtonElement = ensureElement<HTMLButtonElement>('.button_alt[name=card]', this.container);
    this.cashButtonElement = ensureElement<HTMLButtonElement>('.button_alt[name=cash]', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('.form__input[name=address]', this.container);
    this.nextButton = ensureElement<HTMLButtonElement>('.order__button', this.container);

    this.cardButtonElement.addEventListener('click', () => {
      this.events?.emit('order:change', { payment: 'card' });
    });

    this.cashButtonElement.addEventListener('click', () => {
      this.events?.emit('order:change', { payment: 'cash' });
    });

    this.nextButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.events?.emit('order:next');
    });
  }

  set payment(value: 'card' | 'cash' | '') {
    this.cardButtonElement.classList.toggle('button_alt-active', value === 'card');
    this.cashButtonElement.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}