import { useEffect } from "react";

export function BeanTransition({ theme, onComplete }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 1700);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`transition-screen ${theme}`} role="status" aria-live="polite">
      <div className="bean-bag" aria-hidden="true"><span>BEANS</span></div>
      <div className="cart-icon" aria-hidden="true">fontawesome</div>
      <p>{theme === "dark" ? "夜のロースタリーからバッグを準備中…" : "新しい豆のバッグを準備中…"}</p>
    </div>
  );
}
