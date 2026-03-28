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
    let total = 0;
    for (let i = 0; i < this.items.length; i++) {
      total += this.items[i].price ?? 0;
    }
    return total;
  }

  getCount(): number {
    return this.items.length;
  }

  contains(id: string): boolean {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].id === id) {
        return true;
      }
    }
    return false;
  }

}