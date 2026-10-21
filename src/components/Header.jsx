import { APP_CONFIG } from "../lib/config.js";

export function Header({ theme, score, cartQuantity, onThemeToggle }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">A1011</p>
        <h1>Coffee<span>   </span><em>Explorer</em></h1>
      </div>
      <div className="topbar-actions">
        <button
          className="theme-toggle"
          onClick={onThemeToggle}
          aria-label={`テーマを${theme === "light" ? "ダーク" : "ライト"}に変更`}
        >
          {theme === "light" ? "☼" : "☾"}
        </button>
        <div className="score-pill" aria-label={`豆ポイント ${score}`}>
          ✦ {score} <span>/ {APP_CONFIG.scoreThreshold}</span>
        </div>
        <div className={`cart-pill ${cartQuantity ? "has-items" : ""}`} aria-label={`カート ${cartQuantity}個`}>
          🛒 {cartQuantity}
        </div>
      </div>
    </header>
  );
}
