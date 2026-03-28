import './scss/styles.scss';

import { apiProducts } from './utils/data';

import { Catalog } from './components/models/Catalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { Api } from './components/base/Api';
import { AppApi } from './components/AppApi';
import { API_URL, CDN_URL } from './utils/constants';

const catalogModel = new Catalog();
const basketModel = new Basket();
const buyerModel = new Buyer();

catalogModel.setItems(apiProducts.items);
console.log(`Массив товаров из каталога: `, catalogModel.getItems());

basketModel.addItem(apiProducts.items[0]);
basketModel.addItem(apiProducts.items[1]);
console.log(`Товары в корзине: `, basketModel.getItems());

console.log(`Данные покупателя: `, buyerModel.getData());

const api = new Api(API_URL);
const appApi = new AppApi(api, CDN_URL);
const productData = await appApi.getProducts();

catalogModel.setItems(productData.items);
console.log(`Каталог товаров: `, catalogModel.getItems());


