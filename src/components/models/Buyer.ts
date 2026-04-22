import { IBuyer, TPayment } from '../../types';
import { IEvents } from '../base/Events';

export class Buyer {
  private payment: TPayment;
  private address: string;
  private phone: string;
  private email: string;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.payment = '';
    this.address = '';
    this.phone = '';
    this.email = '';
    this.events = events;
  }

  setPayment(payment: TPayment): void {
    this.payment = payment;
    this.events.emit('buyer:changed');
  }
  setAddress(address: string): void {
    this.address = address;
    this.events.emit('buyer:changed');
  }
  setPhone(phone: string): void {
    this.phone = phone;
    this.events.emit('buyer:changed');
  }

  setEmail(email: string): void {
    this.email = email;
    this.events.emit('buyer:changed');
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email
    };
  }

  clear(): void {
    this.payment = '';
    this.address = '';
    this.phone = '';
    this.email = '';
    this.events.emit('buyer:changed');
  }

  validate(): Map<string, string> {
    const errors = new Map<string, string>();

    if (!this.payment) {
      errors.set('payment', 'Выберите способ оплаты');
    }

    if (!this.address.trim()) {
      errors.set('address', 'Укажите адрес доставки');
    }

    if (!this.phone.trim()) {
      errors.set('phone', 'Укажите номер телефона');
    }

    if (!this.email.trim()) {
      errors.set('email', 'Укажите email');
    }

    return errors;
  }

}