import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateWishlistStatus } from "../../redux/features/WishlistSlice";
import { useNavigate, useLocation } from "react-router-dom";
import "./CheckoutForm.css";


const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { amount, productId } = location.state || {};
  const { user } = useSelector((state) => state.user);
  const userId = user?.existUser?._id;

  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!amount) return;

    axios
      .post("http://localhost:5000/api/payment/create-payment-intent", { amount })
      .then((res) => setClientSecret(res.data.clientSecret))
      .catch((err) => console.error("Stripe Error:", err));
  }, [amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setIsLoading(true);

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      alert("❌ Ödəniş uğursuz oldu: " + result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        dispatch(updateWishlistStatus({ userId, productId, status: "purchased" }));
        alert("✅ Ödəniş uğurla tamamlandı!");
        navigate("/mystory");
      }
    }

    setIsLoading(false);
  };

  <CardElement
  key={clientSecret}
  options={{
    style: {
      base: {
        fontSize: "16px",
        color: "#32325d",
        lineHeight: "1.6", // ✅ Bu vacibdir!
        "::placeholder": {
          color: "#a0aec0",
        },
      },
      invalid: {
        color: "#fa755a",
      },
    },
  }}
/>

  return (
    <form onSubmit={handleSubmit} className="payment-form">
      <div className="card-element-wrapper">
        <CardElement
          key={clientSecret}
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#32325d",
                "::placeholder": {
                  color: "#a0aec0",
                },
              },
              invalid: {
                color: "#fa755a",
              },
            },
          }}
        />
      </div>
      <button
        className="pay-button"
        type="submit"
        disabled={!stripe || !clientSecret || isLoading}
      >
        {isLoading ? "Yüklənir..." : "💳 Təsdiqlə və Ödə"}
      </button>
    </form>
    
  );
};

export default CheckoutForm;
