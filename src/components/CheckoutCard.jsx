import { APP_CONFIG } from "../lib/config.js";

export function CheckoutCard({ quantity, checkoutState, onCheckout }) {
  const total = APP_CONFIG.productPrice * quantity;
  const buttonLabel = {
    processing: "決済ページを準備中… 頑張っています...",
    error: "再試行"
  }[checkoutState] || "購入";

  return (
    <aside className="checkout-card" aria-labelledby="checkout-title">
      <div className="card-heading"><h2 id="checkout-title">購入する</h2></div>
      <div className="order-row"><span>{APP_CONFIG.productName}</span><strong>¥{APP_CONFIG.productPrice.toLocaleString()}</strong></div>
      <div className="quantity-row"><label htmlFor="quantity">数量</label><input id="quantity" type="number" min="0" max="10" value={quantity} readOnly /></div>
      <div className="total-row"><span>合計</span><strong>¥{total.toLocaleString()}</strong></div>
      {checkoutState === "success" && <p className="status success">支払いを確認しました。ご注文ありがとうございます。</p>}
      {checkoutState === "cancelled" && <p className="status warning">決済はキャンセルされました。</p>}
      {checkoutState === "error" && <p className="status error">決済を開始できませんでした。サーバー設定を確認して再試行してください。</p>}
      <button className="primary-button checkout-button" disabled={checkoutState === "processing" || quantity < 1} onClick={onCheckout}>
        {buttonLabel}
      </button>
      <small>Stripeのテストモードを使用しています。カード情報はこのサイトでは扱いません。</small>
    </aside>
  );
}
