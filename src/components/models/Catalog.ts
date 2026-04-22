import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class Catalog {
  private items: IProduct[];
  private selectedItem: IProduct | null;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.items = [];
    this.selectedItem = null;
    this.events = events;
  }

  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit('catalog:changed');
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  setSelectedItem(item: IProduct): void {
    this.selectedItem = item;
  }

  getSelectedItem(): IProduct | null {
    return this.selectedItem;
  }
}