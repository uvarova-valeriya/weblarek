import { IProduct } from '../../types/index';
import { ensureElement } from '../../utils/utils';
import { Card } from './Card';
import { categoryMap }  from '../../utils/constants';
import { CategoryKey } from '../../types/index'

interface ICardCatalogActions {
  onClick?: () => void;
}

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