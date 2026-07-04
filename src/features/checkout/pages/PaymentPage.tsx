import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CheckCircle2, CreditCard, Landmark, QrCode, Truck, Wallet } from 'lucide-react';
import { usePlaceOrder, useInitiatePayment, useVerifyPayment, type PaymentMethod } from '@/features/checkout/hooks/useCheckout';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/store/toastStore';
import { cn } from '@/lib/utils';

const METHODS: { key: PaymentMethod; labelKey: string; icon: typeof CreditCard }[] = [
  { key: 'card_credit', labelKey: 'payment.credit_card', icon: CreditCard },
  { key: 'card_debit', labelKey: 'payment.debit_card', icon: CreditCard },
  { key: 'upi', labelKey: 'payment.upi', icon: QrCode },
  { key: 'netbanking', labelKey: 'payment.net_banking', icon: Landmark },
  { key: 'wallet', labelKey: 'payment.wallet', icon: Wallet },
  { key: 'cod', labelKey: 'payment.cod', icon: Truck },
];

type Stage = 'form' | 'otp' | 'success';

export function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useTranslation();
  const state = location.state as { addressId?: string; couponCode?: string } | null;

  const placeOrder = usePlaceOrder();
  const initiatePayment = useInitiatePayment();
  const verifyPayment = useVerifyPayment();

  const [method, setMethod] = useState<PaymentMethod>('card_credit');
  const [stage, setStage] = useState<Stage>('form');
  const [orderId, setOrderId] = useState<string>();
  const [paymentId, setPaymentId] = useState<string>();
  const [otp, setOtp] = useState('');

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [vpa, setVpa] = useState('');
  const [bankCode, setBankCode] = useState('HDFC');
  const [walletProvider, setWalletProvider] = useState('paytm');

  if (!state?.addressId) {
    navigate('/checkout');
    return null;
  }

  function detailsFor(method: PaymentMethod): Record<string, string> {
    if (method === 'card_credit' || method === 'card_debit') {
      return { cardNumber, expiry, cvv, name: cardName };
    }
    if (method === 'upi') return { vpa };
    if (method === 'netbanking') return { bankCode };
    if (method === 'wallet') return { walletProvider };
    return {};
  }

  async function handlePay() {
    try {
      const order = await placeOrder.mutateAsync({
        addressId: state!.addressId!,
        couponCode: state?.couponCode,
        paymentMethod: method,
      });
      setOrderId(order.id);

      const initiated = await initiatePayment.mutateAsync({
        orderId: order.id,
        method,
        details: detailsFor(method),
      });
      setPaymentId(initiated.paymentId);

      if (initiated.requiresOtp) {
        setStage('otp');
      } else {
        // The server throws (rejects) on any payment failure — a resolved
        // verify call always means success, there's no {status:'failed'} case.
        await verifyPayment.mutateAsync({ paymentId: initiated.paymentId });
        setStage('success');
      }
    } catch {
      toast.error('Something went wrong placing your order');
    }
  }

  async function handleVerifyOtp() {
    if (!paymentId) return;
    try {
      await verifyPayment.mutateAsync({ paymentId, otp });
      setStage('success');
    } catch {
      toast.error('Incorrect OTP — please try again');
    }
  }

  if (stage === 'success' && orderId) {
    return (
      <div className="container flex min-h-[70vh] flex-col items-center justify-center gap-4 py-16 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
        >
          <CheckCircle2 className="size-20 text-success" />
        </motion.div>
        <h1 className="text-2xl font-bold">{t('payment.success_title')}</h1>
        <p className="text-muted-foreground">{t('payment.success_subtitle')}</p>
        <div className="mt-4 flex gap-3">
          <Button onClick={() => navigate(`/orders/${orderId}`)}>{t('payment.view_order')}</Button>
          <Button variant="outline" onClick={() => navigate('/products')}>
            {t('payment.continue_shopping')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container flex justify-center py-8">
      <Card className="w-full max-w-lg">
        <CardBody className="space-y-5">
          {stage === 'form' ? (
            <>
              <h1 className="text-xl font-semibold">{t('payment.choose_method')}</h1>
              <div className="grid grid-cols-3 gap-2">
                {METHODS.map(({ key, labelKey, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setMethod(key)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium',
                      method === key ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-border text-muted-foreground',
                    )}
                  >
                    <Icon className="size-5" />
                    {t(labelKey)}
                  </button>
                ))}
              </div>

              {(method === 'card_credit' || method === 'card_debit') && (
                <div className="space-y-3">
                  <Input label={t('payment.card_number')} placeholder="4242 4242 4242 4242" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input label={t('payment.expiry')} placeholder="MM/YY" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
                    <Input label={t('payment.cvv')} placeholder="123" value={cvv} onChange={(e) => setCvv(e.target.value)} />
                  </div>
                  <Input label={t('payment.name_on_card')} value={cardName} onChange={(e) => setCardName(e.target.value)} />
                </div>
              )}

              {method === 'upi' && (
                <Input label={t('payment.upi_id')} placeholder="yourname@bank" value={vpa} onChange={(e) => setVpa(e.target.value)} />
              )}

              {method === 'netbanking' && (
                <Select label={t('payment.bank')} value={bankCode} onChange={(e) => setBankCode(e.target.value)}>
                  <option value="HDFC">HDFC Bank</option>
                  <option value="ICICI">ICICI Bank</option>
                  <option value="SBI">State Bank of India</option>
                  <option value="AXIS">Axis Bank</option>
                </Select>
              )}

              {method === 'wallet' && (
                <Select label={t('payment.wallet')} value={walletProvider} onChange={(e) => setWalletProvider(e.target.value)}>
                  <option value="paytm">Paytm</option>
                  <option value="phonepe">PhonePe</option>
                  <option value="amazonpay">Amazon Pay</option>
                </Select>
              )}

              {method === 'cod' && <p className="text-sm text-muted-foreground">{t('payment.cod_note')}</p>}

              <Button
                size="lg"
                className="w-full"
                isLoading={placeOrder.isPending || initiatePayment.isPending || verifyPayment.isPending}
                onClick={handlePay}
              >
                {t('payment.pay_now')}
              </Button>
            </>
          ) : (
            <>
              <h1 className="text-xl font-semibold">{t('payment.verify_payment')}</h1>
              <p className="text-sm text-muted-foreground">
                {t('payment.otp_prompt')} <strong>{t('payment.demo_otp')}</strong>
              </p>
              <Input label={t('payment.otp')} value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} />
              <Button size="lg" className="w-full" isLoading={verifyPayment.isPending} onClick={handleVerifyOtp}>
                {t('payment.verify_and_pay')}
              </Button>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
