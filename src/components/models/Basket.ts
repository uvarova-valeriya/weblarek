import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

export class BasketModel {
  private items: IProduct[];
  protected events: IEvents;

  constructor(events: IEvents) {
    this.items = [];
    this.events = events;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    this.items.push(item);
    this.events.emit('basket:changed');
  }

  removeItem(id: string): void {
    this.items = this.items.filter(items => items.id !== id);
    this.events.emit('basket:changed');
  }

  clear(): void {
    this.items = [];
    this.events.emit('basket:changed');
  }

  getTotal(): number {
    return this.items.reduce((acc, item) => acc + (item.price || 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  contains(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }

}