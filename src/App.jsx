import { useEffect, useMemo, useRef, useState } from "react";
import originData from "../originsg.json";
import { CheckoutCard } from "./components/CheckoutCard.jsx";
import { Header } from "./components/Header.jsx";
import { OriginDetailsModal } from "./components/OriginDetailsModal.jsx";
import { OriginMap } from "./components/OriginMap.jsx";
import { BeanTransition } from "./components/BeanTransition.jsx";
import { APP_CONFIG } from "./lib/config.js";
import { normalizeOrigins } from "./lib/origins.js";

export default function App() {
  const origins = useMemo(() => normalizeOrigins(originData), []);
  const [theme, setTheme] = useState("light");
  const [score, setScore] = useState(0);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [showTransition, setShowTransition] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [checkoutState, setCheckoutState] = useState("idle");
  const thresholdHandled = useRef(false);

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

  const handleOriginSelect = (origin) => {
    setSelectedOrigin(origin);
    setScore((currentScore) => {
      const nextScore = currentScore + APP_CONFIG.scorePerOrigin;
      if (nextScore >= APP_CONFIG.scoreThreshold && !thresholdHandled.current) {
        thresholdHandled.current = true;
        window.setTimeout(() => setShowTransition(true), 0);
      }
      return nextScore;
    });
  };

  const handleTransitionComplete = () => {
    setShowTransition(false);
    setCartQuantity((quantity) => quantity + 1);
  };

  const handleCheckout = async () => {
    if (checkoutState === "processing") return;
    setCheckoutState("processing");
    try {
      const response = await fetch("/api/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: Math.max(cartQuantity, 1) })
      });
      const result = await response.json();
      if (!response.ok || !result.checkoutUrl) throw new Error(result.error || "checkout");
      window.location.assign(result.checkoutUrl);
    } catch {
      setCheckoutState("error");
    }
  };

  return (
    <main className="app-shell">
      <Header
        theme={theme}
        score={score}
        cartQuantity={cartQuantity}
        onThemeToggle={() => setTheme((current) => current === "light" ? "dark" : "light")}
      />
      {/* <Hero score={score} /> */}
      <section className="content-grid">
        <OriginMap origins={origins} onOriginSelect={handleOriginSelect} />
        <CheckoutCard
          quantity={Math.max(cartQuantity, 1)}
          checkoutState={checkoutState}
          onCheckout={handleCheckout}
        />
      </section>
      {selectedOrigin && (
        <OriginDetailsModal
          origin={selectedOrigin}
          onClose={() => setSelectedOrigin(null)}
        />
      )}
      {showTransition && (
        <BeanTransition theme={theme} onComplete={handleTransitionComplete} />
      )}
    </main>
  );
}
