export type PaymentStatus = 'initiated' | 'success' | 'failed' | 'pending_otp';

export interface Payment {
  id: string;
  orderId: string;
  method: string;
  status: PaymentStatus;
  amount: number;
  currency: string;
  createdAt: string;
}
