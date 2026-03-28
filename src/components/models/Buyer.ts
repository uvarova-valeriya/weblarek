import { IBuyer, TPayment } from '../../types';

export class Buyer {
  payment: TPayment;
  address: string;
  phone: string;
  email: string;

  constructor() {
    this.payment = '';
    this.address = '';
    this.phone = '';
    this.email = '';
  }

  setPayment(payment: TPayment): void {
    this.payment = payment;
  }
  setAddress(address: string): void {
    this.address = address;
  }
  setPhone(phone: string): void {
    this.phone = phone;

  }
  setEmail(email: string): void {
    this.email = email;
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