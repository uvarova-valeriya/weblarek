import { IProduct } from '../../types/index'
import { ensureElement } from '../../utils/utils'
import { Card } from './Card';

interface ICardCatalogActions {
  onClick?: () => void;
}

export const categoryMap = {
  'софт-скил': 'card__category_soft',
  'хард-скил': 'card__category_hard',
  'другое': 'card__category_other',
  'дополнительное': 'card__category_additional',
  'кнопка': 'card__category_button',
};

export type CategoryKey = keyof typeof categoryMap;

export type ICardCatalogData = Pick<IProduct, 'title' | 'price' | 'category' | 'image'>;

export class CardCatalog extends Card<ICardCatalogData> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardCatalogActions) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);

    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
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
}