import './scss/styles.scss';

// import { apiProducts } from './utils/data';
import { ensureElement } from './utils/utils';
import { IProduct } from './types/index'

import { Catalog } from './components/models/Catalog';
import { BasketModel } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { Api } from './components/base/Api';
import { AppApi } from './components/AppApi';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { cloneTemplate } from './utils/utils';

import { Header } from './components/view/Header';
import { Basket } from './components/view/Basket';
// import { Card } from './components/view/Card';
import { CardBasket } from './components/view/CardBasket';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { Contacts } from './components/view/Contacts';
// import { Form } from './components/view/Form';
import { Gallery } from './components/view/Gallery';
import { Modal } from './components/view/Modal';
import { Order } from './components/view/Order';
import { Succsess } from './components/view/Succsess';

const events = new EventEmitter();

const catalogModel = new Catalog(events);
const basketModel = new BasketModel(events);
const buyerModel = new Buyer(events);


const api = new Api(API_URL);
const appApi = new AppApi(api, CDN_URL);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview') as HTMLTemplateElement;
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket') as HTMLTemplateElement;
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket') as HTMLTemplateElement;
const orderTemplate = ensureElement<HTMLTemplateElement>('#order') as HTMLTemplateElement;
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts') as HTMLTemplateElement;
const successTemplate = ensureElement<HTMLTemplateElement>('#success') as HTMLTemplateElement;

const headerContainer = ensureElement<HTMLElement>('.header') as HTMLElement;
const galleryContainer = ensureElement<HTMLElement>('.gallery') as HTMLElement;
const modalContainer = ensureElement<HTMLElement>('#modal-container') as HTMLElement;

const header = new Header(headerContainer, events);
const gallery = new Gallery(galleryContainer);
const modal = new Modal(modalContainer, events);

const cardElement = cloneTemplate(basketTemplate);
const basketView = new Basket(cardElement, events);

appApi.getProducts()
  .then((productData) => {
    catalogModel.setItems(productData.items);
    console.log(`Каталог товаров с сервера: `, catalogModel.getItems());
  })
  .catch((error) => {
    console.error(`Ошибка при получении товаров с сервера: `, error);
  });

events.on('catalog:changed', () => {
  const products = catalogModel.getItems();
  const cards = products.map(product => {
    const cardElement = cloneTemplate(cardCatalogTemplate);
    const card = new CardCatalog(cardElement, {
      onClick: () => events.emit('card:select', product)
    });
    return card.render(product);
  });
  gallery.render({ catalog: cards });
});

events.on('card:select', (product: IProduct) => {
  catalogModel.setSelectedItem(product);
});

events.on('selected:changed', () => {
  const product = catalogModel.getSelectedItem();
  if (!product) return;

  const inBasket = basketModel.contains(product.id);
  const cardElement = cloneTemplate(cardPreviewTemplate);
  const preview = new CardPreview(cardElement, events);

  preview.title = product.title;
  preview.category = product.category;
  preview.description = product.description;
  preview.image = product.image;
  preview.price = product.price;
  preview.inBasket = inBasket;

  modal.content = preview.render();
  modal.open();
});

events.on('preview:button-click', () => {
  const product = catalogModel.getSelectedItem();
  if (!product) return;

  if (basketModel.contains(product.id)) {
    events.emit('card:remove-from-basket', { id: product.id });
    modal.close();
  } else {
    events.emit('card:add-to-basket', product);
    events.emit('selected:changed');
  }
});

events.on('card:add-to-basket', (product: IProduct) => {
  basketModel.addItem(product);
});

events.on('card:remove-from-basket', (data: { id: string }) => {
  basketModel.removeItem(data.id);
});

events.on('basket:changed', () => {
  header.counter = basketModel.getCount();
  const items = basketModel.getItems();
  const cards = items.map((item, idx) => {
    const cardElement = cloneTemplate(cardBasketTemplate);
    const card = new CardBasket(cardElement, {
      onRemove: () => {
        events.emit('card:remove-from-basket', { id: item.id });
      }
    });
    card.render(item);
    card.index = idx + 1;
    return cardElement;
  });
  basketView.items = cards;
  basketView.total = basketModel.getTotal();
});

events.on('basket:open', () => {
  events.emit('basket:changed');
  modal.content = basketView.render();
  modal.open();
});

events.on('order:change', (data: any) => {
  if (data.payment) buyerModel.setPayment(data.payment);
  if (data.address) buyerModel.setAddress(data.address);
});

events.on('contacts:change', (data: any) => {
  if (data.email) buyerModel.setEmail(data.email);
  if (data.phone) buyerModel.setPhone(data.phone);
});

events.on('basket:checkout', () => {
  const orderElement = cloneTemplate(orderTemplate) as HTMLFormElement;
  const orderForm = new Order(orderElement, events);

  events.emit('order:form-created', { form: orderForm });
  modal.content = orderForm.render();
  modal.open();
  events.emit('buyer:changed');
});

events.on('order:form-created', ({ form }: { form: Order }) => {
  events.on('buyer:changed', () => {
    const buyerData = buyerModel.getData();
    form.payment = buyerData.payment;
    form.address = buyerData.address;

    const errors = buyerModel.validate();
    form.errors = [errors.get('payment'), errors.get('address')]
      .filter(Boolean)
      .join(', ');
    form.valid = !errors.has('payment') && !errors.has('address');
  });
});

events.on('order:next', () => {
  modal.close();

  const contactsElement = cloneTemplate(contactsTemplate) as HTMLFormElement;
  const contactsForm = new Contacts(contactsElement, events);

  events.emit('contacts:form-created', { form: contactsForm });
  modal.content = contactsForm.render();
  events.emit('buyer:changed');
  modal.open();
});

events.on('contacts:form-created', ({ form }: { form: Contacts }) => {
  events.on('buyer:changed', () => {
    const buyerData = buyerModel.getData();
    const errors = buyerModel.validate();

    form.email = buyerData.email;
    form.phone = buyerData.phone;

    const contactErrors = [errors.get('email'), errors.get('phone')]
      .filter(Boolean)
      .join(', ');
    form.errors = contactErrors;

    form.valid = !errors.has('email') && !errors.has('phone');
  });
});

events.on('order:submit', async () => {
  const buyerData = buyerModel.getData();

  const order = {
    payment: buyerData.payment,
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    total: basketModel.getTotal(),
    items: basketModel.getItems().map(item => item.id)
  };


  try {
    const result = await appApi.postOrder(order);
    events.emit('success:open', { total: result.total });

    basketModel.clear();
    buyerModel.clear();

  } catch (error) {
    console.error('Ошибка оформления заказа:', error);
  }
});

events.on('success:open', ({ total }: { total: number }) => {
  const successElement = cloneTemplate(successTemplate);
  const success = new Succsess(successElement, events);
  success.total = total;

  modal.content = success.render();
  modal.open();
});

events.on('success:close', () => {
  modal.close();
});