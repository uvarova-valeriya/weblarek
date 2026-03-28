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

const firstProductId = apiProducts.items[0].id;
console.log(`Первый товар в массиве: `, catalogModel.getItemById(firstProductId));

catalogModel.setSelectedItem(apiProducts.items[2]);
console.log(`Подробная информация о выбранном товаре: `, catalogModel.getSelectedItem());

basketModel.addItem(apiProducts.items[0]);
basketModel.addItem(apiProducts.items[1]);
console.log(`Товары в корзине: `, basketModel.getItems());
console.log(`Общая стоимость товаров в корзине: `, basketModel.getTotal());
console.log(`Количество товаров в корзине: `, basketModel.getCount());
console.log(`Проверяем наличие товара ${apiProducts.items[0].id} в корзине: `, basketModel.contains(apiProducts.items[0].id));
console.log(`Проверяем наличие товара, которого нет в корзине: `, basketModel.contains(apiProducts.items[3].id));
basketModel.removeItem(apiProducts.items[0].id);
console.log(`Товары в корзине после удаления одного товара: `, basketModel.getItems());
basketModel.clear();
console.log(`Очистили корзину: `, basketModel.getItems());

buyerModel.setPayment('card');
buyerModel.setAddress('Москва, ул. Тверская, д.1');
buyerModel.setPhone('+79991234567');
console.log(`Результат валидации (email не указан): `, buyerModel.validate());
buyerModel.setEmail('test@example.com');
console.log(`Данные покупателя: `, buyerModel.getData());
console.log(`Результат валидации (все поля заполнены): `, buyerModel.validate());
buyerModel.clear();
console.log(`Очистили данные о покупателе: `, buyerModel.getData());
console.log(`Результат валидации (все поля пустые): `, buyerModel.validate());

const api = new Api(API_URL);
const appApi = new AppApi(api, CDN_URL);


appApi.getProducts()
  .then((productData) => {
    catalogModel.setItems(productData.items);
    console.log(`Каталог товаров с сервера: `, catalogModel.getItems());
  })
  .catch((error) => {
    console.error(`Ошибка при получении товаров с сервера: `, error);
  });