import "dotenv/config";
import express from "express";
import Stripe from "stripe";
import { readFileSync } from "node:fs";
import { APP_CONFIG } from "../src/lib/config.js";
import { getBlendPoints, getBlendPrice } from "../src/lib/blend.js";

const app = express();
const port = process.env.PORT || 3001;
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;
const stripePriceOrProductId = process.env.STRIPE_PRICE_ID;
const originData = JSON.parse(
  readFileSync(new URL("../originsg.json", import.meta.url), "utf8")
);
const validOriginIds = new Set(Object.values(originData).map((origin) => origin?.id).filter(Boolean));

app.use(express.json());

app.post("/api/checkout-session", async (request, response) => {
  if (!stripe) {
    response.status(503).json({ error: "Stripe test mode is not configured on the server." });
    return;
  }

  const items = request.body?.items;
  if (
    !Array.isArray(items)
    || items.length < 1
    || items.length > 10
    || items.some((id) => typeof id !== "string" || !validOriginIds.has(id))
  ) {
    response.status(400).json({ error: "Blend items must contain 1 to 10 valid origin IDs." });
    return;
  }

  const points = getBlendPoints(items.map((id) => ({ id })));
  const amount = getBlendPrice(points);

  try {
    const baseUrl = process.env.PUBLIC_APP_URL || "http://localhost:5173";
    if (!stripePriceOrProductId) {
      response.status(503).json({ error: "STRIPE_PRICE_ID is not configured on the server." });
      return;
    }

    const lineItem = stripePriceOrProductId.startsWith("price_")
      ? { price: stripePriceOrProductId, quantity: 1 }
      : {
          price_data: {
            currency: APP_CONFIG.pricing.currency,
            product: stripePriceOrProductId,
            unit_amount: amount
          },
          quantity: 1
        };
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [lineItem],
      success_url: `${baseUrl}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/?checkout=cancelled`,
      metadata: {
        blendItems: JSON.stringify(items),
        points: String(points),
        amount: String(amount)
      }
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
