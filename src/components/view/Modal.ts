import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Modal<T> extends Component<T> {
  protected closeButtonElement: HTMLButtonElement;
  protected contentContainerElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.closeButtonElement = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentContainerElement = ensureElement<HTMLElement>('.modal__content', this.container);

    this.closeButtonElement.addEventListener(('click'), () => {
      this.close();
    });

    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) {
        this.close();
      }
    });
  }

  open(): void {
    this.container.classList.add('modal_active');
    this.events.emit('modal:open');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this.contentContainerElement.innerHTML = '';
    this.events.emit('modal:close');
  }

  isOpen(): boolean {
    return this.container.classList.contains('modal_active');
  }

  set content(value: HTMLElement) {
    this.contentContainerElement.innerHTML = '';
    this.contentContainerElement.appendChild(value);
  }
}