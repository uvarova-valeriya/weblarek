import { IProduct } from '../../types';

export class Basket {
  items: IProduct[];

  constructor() {
    this.items = [];
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    this.items.push(item);
  }

  removeItem(id: string): void {
    this.items = this.items.filter(items => items.id !== id);
  }

  clear(): void {
    this.items = [];
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