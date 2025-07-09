import express from "express";
import Stripe from "stripe";
import "dotenv/config";

const router = express.Router();

// Stripe obyektini `.env` faylındakı gizli açarla yarat
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Frontend ödəniş istəyi buraya gələcək
router.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body; // frontend bizə məbləği göndərəcək (cent-lə: 5000 = 50.00)

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd", // istəyirsənsə 'eur' və ya 'azn' da ola bilər, Stripe dəstəkləyirsə
      payment_method_types: ["card"],
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    res.status(500).send({ error: error.message });
  }
});

export default router;
