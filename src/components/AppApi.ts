import { IApi, IProduct, IOrder, IOrderResult } from '../types';

export class AppApi {
  private _api: IApi;
  private _CDN_URL: string;

  constructor(api: IApi, CDN_URL: string) {
    this._api = api;
    this._CDN_URL = CDN_URL;
  }

  async getProducts(): Promise<{ total: number; items: IProduct[] }> {
    const result = await this._api.get<{ total: number; items: IProduct[] }>('/product');
    result.items = result.items.map(item => ({
      ...item,
      image: this._CDN_URL + item.image
    }));
    return result;
  }
  async postOrder(order: IOrder): Promise<IOrderResult> {
    return this._api.post<IOrderResult>('/order', order);
  }
}