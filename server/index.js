import "dotenv/config";
import express from "express";
import Stripe from "stripe";

const app = express();
const port = process.env.PORT || 3001;
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;
const product = {
  name: "Coffee Bean Explorer sample bag",
  unitAmount: 1800,
  currency: "jpy"
};

app.use(express.json());

app.post("/api/checkout-session", async (request, response) => {
  if (!stripe) {
    response.status(503).json({ error: "Stripe test mode is not configured on the server." });
    return;
  }

  const quantity = Number(request.body?.quantity);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
    response.status(400).json({ error: "Quantity must be an integer between 1 and 10." });
    return;
  }

  try {
    const baseUrl = process.env.PUBLIC_APP_URL || "http://localhost:5173";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        price_data: {
          currency: product.currency,
          product_data: { name: product.name },
          unit_amount: product.unitAmount
        },
        quantity
      }],
      success_url: `${baseUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?checkout=cancelled`,
      metadata: { quantity: String(quantity) }
    });

    response.json({ sessionId: session.id, checkoutUrl: session.url });
  } catch (error) {
    console.error("Stripe checkout session creation failed", error);
    response.status(502).json({ error: "Unable to start checkout. Please retry." });
  }
});

app.get("/api/checkout-status", async (request, response) => {
  if (!stripe || typeof request.query.session_id !== "string") {
    response.status(400).json({ error: "A Stripe session_id is required." });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(request.query.session_id);
    response.json({
      status: session.payment_status,
      paymentStatus: session.status
    });
  } catch (error) {
    console.error("Stripe checkout status verification failed", error);
    response.status(502).json({ error: "Unable to verify payment status." });
  }
});

app.listen(port, () => {
  console.log(`Checkout server listening on http://localhost:${port}`);
});
