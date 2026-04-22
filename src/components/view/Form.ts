import { ensureElement } from '../../utils/utils'
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Form<T> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsContainer: HTMLElement;
  protected formName: string;

  constructor(container: HTMLFormElement, protected events?: IEvents) {
    super(container);

    this.submitButton = ensureElement<HTMLButtonElement>('.button[type=submit]', this.container);
    this.errorsContainer = ensureElement<HTMLElement>('.form__errors', this.container);
    this.formName = this.container.getAttribute('name') || 'form';

    this.container.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      if (target.name) {
        this.events?.emit(`${this.formName}:change`, { [target.name]: target.value });
      }
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsContainer.textContent = value;
  }

  clear(): void {
    (this.container as HTMLFormElement).reset();
    this.errors = '';
  }

  render(data?: Partial<T>): HTMLElement {
    super.render(data);
    return this.container;
  }
}