import { Component } from '../base/Component';

interface IGalleryData {
  catalog: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
  protected catalogElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.catalogElement = this.container;
  }

  set catalog(items: HTMLElement[]) {
    items.forEach(item => {
      this.catalogElement.appendChild(item);
    });
  }
}