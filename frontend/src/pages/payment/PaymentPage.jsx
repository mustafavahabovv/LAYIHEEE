import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import { useLocation } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import './PaymentPage.css'; // <-- Stil faylı əlavə olundu

const PaymentPage = () => {
  const location = useLocation();
  const { amount, productId } = location.state || {};
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

  return (
    <div className="payment-container">
      <div className="payment-box">
        <h2 className="payment-title">Kartla Ödəniş</h2>
        <Elements stripe={stripePromise}>
          <CheckoutForm amount={amount} productId={productId} />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentPage;
