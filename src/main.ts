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

let currentModalContent: 'basket' | 'order' | 'contacts' | 'success' | null = null;
let currentOrderForm: Order | null = null;
let currentContactsForm: Contacts | null = null;

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
  const cardElement = cloneTemplate(cardPreviewTemplate);
  let inBasketLet = basketModel.contains(product.id);
  const preview = new CardPreview(cardElement, {
    onAddToBasket: () => {
      if (inBasketLet) {
        events.emit('card:remove-from-basket', { id: product.id });
        modal.close();
      } else {
        events.emit('card:add-to-basket', product);
      }
      inBasketLet = !inBasketLet;
      preview.inBasket = inBasketLet;
    }
  });
  preview.inBasket = inBasketLet;
  preview.render(product);
  modal.content = cardElement;
  modal.open();
});

events.on('card:add-to-basket', (product: IProduct) => {
  basketModel.addItem(product);
});

events.on('card:remove-from-basket', (data: { id: string }) => {
  basketModel.removeItem(data.id);
});

events.on('modal:close', () => {
  currentModalContent = null;
});

events.on('basket:changed', () => {
  header.counter = basketModel.getCount();
  if (currentModalContent === 'basket') {
  const basketElement = cloneTemplate(basketTemplate);
  const basketView = new Basket(basketElement, events);
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
  modal.content = basketElement;
  }
});

events.on('basket:open', () => {
  currentModalContent = 'basket';
  const basketElement = cloneTemplate(basketTemplate);
  const basketView = new Basket(basketElement, events);
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

  modal.content = basketElement;
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

events.on('buyer:changed', () => {
  const buyerData = buyerModel.getData();

  const isOrderValid = !!(buyerData.payment && buyerData.address.trim());
  if (currentOrderForm) {
    currentOrderForm.valid = isOrderValid;
  }

  const isContactValid = !!(buyerData.email && buyerData.phone);
  if (currentContactsForm) {
    currentContactsForm.valid = isContactValid;
  }
});

events.on('basket:checkout', () => {
  currentModalContent = 'order';
  const orderElement = cloneTemplate(orderTemplate) as HTMLFormElement;
  currentOrderForm = new Order(orderElement, events, {
    onPaymentChange: (payment) => {
      buyerModel.setPayment(payment);
      if (currentOrderForm) {
        currentOrderForm.payment = payment;
      }
    },
    onAddressChange: (address) => {
      buyerModel.setAddress(address);
      if (currentOrderForm) {
        currentOrderForm.address = address;
      }
    }
  });

  modal.content = orderElement;
  // modal.open();
});

events.on('order:next', () => {
  currentModalContent = 'contacts';
  const contactsElement = cloneTemplate(contactsTemplate) as HTMLFormElement;
  currentContactsForm = new Contacts(contactsElement, events);

  modal.content = contactsElement;
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

    const successElement = cloneTemplate(successTemplate);
    const success = new Succsess(successElement, events);
    success.total = result.total;

    modal.content = successElement;
    modal.open();

    basketModel.clear();
    buyerModel.clear();

  } catch (error) {
    console.error('Ошибка оформления заказа:', error);
  }
});

events.on('success:close', () => {
  modal.close();
});