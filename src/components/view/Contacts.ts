import { ensureElement } from '../../utils/utils'
import { Form } from './Form';
import { IEvents } from '../base/Events';

export interface IContactsForm {
  email: string;
  phone: string;
}

export class Contacts extends Form<IContactsForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;
  protected submitButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
    this.submitButton = ensureElement<HTMLButtonElement>('.button[type=submit]', this.container);

    this.submitButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.events?.emit('order:submit');
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
