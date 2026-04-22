import { IProduct } from '../../types/index'
import { ensureElement } from '../../utils/utils'
import { Card } from './Card';
import { categoryMap, CategoryKey } from './CardCatalog';

interface ICardPreviewActions {
  onAddToBasket?: () => void;
}

export type ICardPreviewData = Pick<IProduct, 'title' | 'price' | 'category' | 'image' | 'description'>;

export class CardPreview extends Card<ICardPreviewData> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected inBasketElement: boolean = false;

  constructor(container: HTMLElement, actions?: ICardPreviewActions) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (actions?.onAddToBasket) {
      this.buttonElement.addEventListener('click', actions.onAddToBasket);
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value
      );
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, this.title);
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set inBasket(value: boolean) {
    this.inBasketElement = value;
    this.buttonElement.textContent = value ? 'Удалить из корзины' : 'В корзину';
  }

  set price(value: number | null) {
    super.price = value;
    if (value === null) {
      this.buttonElement.disabled = true;
      this.buttonElement.textContent = 'Недоступно';
    }
  }
}