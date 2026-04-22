import { IProduct } from '../../types/index'
import { ensureElement } from '../../utils/utils'
import { Card } from './Card';

interface ICardBasketActions {
  onRemove?: () => void;
}

export type ICardBasketData = Pick<IProduct, 'title' | 'price'>;

export class CardBasket extends Card<ICardBasketData> {
  protected indexElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor (container: HTMLElement, action?: ICardBasketActions) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if (action?.onRemove) {
      this.buttonElement.addEventListener('click', action.onRemove);
    }
  }

  set index(value: number){
    this.indexElement.textContent = String(value);
  }
}

