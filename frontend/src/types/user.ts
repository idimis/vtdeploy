// types/user.ts

export interface User {
    name: string;
    dob: string;
    email: string;
    phone: string;
  }


export interface EventDetails {
  id: string;
  name: string;
  date: string;
  time: string;
  description: string;
}

export interface PaymentForm {
  fullName: string;
  email: string;
  paymentMethod: string;
}
