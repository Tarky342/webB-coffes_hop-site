import { useEffect, useMemo, useRef, useState } from "react";
import originData from "../originsg.json";
import { CheckoutCard } from "./components/CheckoutCard.jsx";
import { Header } from "./components/Header.jsx";
import { OriginDetailsModal } from "./components/OriginDetailsModal.jsx";
import { OriginMap } from "./components/OriginMap.jsx";
import { BeanTransition } from "./components/transitions/BeanTransition.jsx";
import { APP_CONFIG, MAP_CONFIG } from "./lib/config.js";
import { getBlendPoints, getBlendPrice } from "./lib/blend.js";
import { normalizeOrigins } from "./lib/origins.js";

export default function App() {
  const origins = useMemo(() => normalizeOrigins(originData), []);
  const [theme, setTheme] = useState("light");
  const [blendItems, setBlendItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [showTransition, setShowTransition] = useState(false);
  const [checkoutState, setCheckoutState] = useState("idle");
  const transitionStarted = useRef(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (params.get("checkout") === "cancelled") setCheckoutState("cancelled");
    if (!sessionId) return;

    fetch(`/api/checkout-status?session_id=${encodeURIComponent(sessionId)}`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("status")))
      .then((result) => setCheckoutState(result.status === "paid" ? "success" : "error"))
      .catch(() => setCheckoutState("error"));
  }, []);

  const score = getBlendPoints(blendItems);
  const cartQuantity = cartItems.length;

  const handleOriginSelect = (origin) => {
    setSelectedOrigin(origin);
  };

  const handleAddToBlend = (origin) => {
    setBlendItems((items) => [...items, origin]);
    setSelectedOrigin(null);
  };

  const handleRemoveFromBlend = (index) => {
    if (cartItems.length > 0) {
      setCartItems((items) => items.filter((_, itemIndex) => itemIndex !== index));
      setBlendItems((items) => items.filter((_, itemIndex) => itemIndex !== index));
      return;
    }
    setBlendItems((items) => items.filter((_, itemIndex) => itemIndex !== index));
  };

  const createCheckoutSession = async (items) => {
    const points = getBlendPoints(items);
    const amount = getBlendPrice(points);
    setCheckoutState("processing");
    try {
      const response = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ id }) => id),
          points,
          amount
        })
      });
      const result = await response.json();
      if (!response.ok || !result.checkoutUrl) throw new Error(result.error || "checkout");
      window.location.assign(result.checkoutUrl);
    } catch {
      transitionStarted.current = false;
      setCheckoutState("error");
    }
  };

  const handleCheckout = () => {
    if (checkoutState === "processing" || transitionStarted.current || blendItems.length === 0) return;
    transitionStarted.current = true;
    setCheckoutState("transitioning");
    setShowTransition(true);
  };

  const handleTransitionComplete = () => {
    setShowTransition(false);
    const confirmedItems = [...blendItems];
    setCartItems(confirmedItems);
    createCheckoutSession(confirmedItems);
  };

  return (
    <main className="app-shell" style={{ maxWidth: `${MAP_CONFIG.layout.maxWidth}px` }}>
      <Header
        theme={theme}
        score={score}
        cartQuantity={cartQuantity}
        onThemeToggle={() => setTheme((current) => current === "light" ? "dark" : "light")}
      />
      {/* <Hero score={score} /> */}
      <section className="content-grid">
        <OriginMap
          origins={origins}
          theme={theme}
          onOriginSelect={handleOriginSelect}
        />
        <CheckoutCard
          blendItems={blendItems}
          cartItems={cartItems}
          checkoutState={checkoutState}
          onCheckout={handleCheckout}
          onRemove={handleRemoveFromBlend}
        />
      </section>
      {selectedOrigin && (
        <OriginDetailsModal
          origin={selectedOrigin}
          onClose={() => setSelectedOrigin(null)}
          onAddToBlend={handleAddToBlend}
        />
      )}
      {showTransition && (
        <BeanTransition
          theme={theme}
          onComplete={handleTransitionComplete}
        />
      )}
    </main>
  );
}
