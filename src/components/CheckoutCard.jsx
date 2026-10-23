import {
  Alert,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import { APP_CONFIG } from "../lib/config.js";
import { getBlendPoints, getBlendPrice } from "../lib/blend.js";

export function CheckoutCard({
  blendItems,
  cartItems,
  checkoutState,
  onCheckout,
  onRemove
}) {
  const items = cartItems.length > 0 ? cartItems : blendItems;
  const points = getBlendPoints(items);
  const total = getBlendPrice(points);
  const buttonLabel = {
    transitioning: "ブレンドを準備中…",
    processing: "決済ページを準備中…",
    error: "再試行"
  }[checkoutState] || "購入";

  return (
    <Card
      component="aside"
      aria-labelledby="checkout-title"
      elevation={0}
      sx={{
        background: "var(--panel)",
        color: "var(--ink)",
        border: "1px solid var(--line)",
        borderRadius: 0
      }}
    >
      <CardContent sx={{ p: 2.25 }}>
        <Typography id="checkout-title" variant="h2" sx={{ fontSize: 23, mb: 2 }}>
          ブレンドを購入する
        </Typography>
        <Stack spacing={1} aria-label="ブレンドの構成">
          {items.length === 0 ? (
            <Typography variant="body2" sx={{ color: "var(--muted)", py: 1 }}>
              地図から豆を選び、ブレンドに追加してください。
            </Typography>
          ) : items.map((item, index) => (
            <Stack
              key={`${item.id}-${index}`}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ borderTop: "1px solid var(--line)", pt: 1, gap: 1 }}
            >
              <Stack spacing={.25} minWidth={0}>
                <Typography variant="body2" fontWeight={600}>{item.name}</Typography>
                {item.flavorNotes?.length > 0 && (
                  <Typography variant="caption" sx={{ color: "var(--muted)" }}>
                    {item.flavorNotes.slice(0, 2).join(" / ")}
                  </Typography>
                )}
                <Typography variant="caption" sx={{ color: "var(--muted)" }}>
                  {APP_CONFIG.score.awardAmount} pt
                </Typography>
              </Stack>
              <IconButton
                size="small"
                aria-label={`${item.name}を削除`}
                onClick={() => onRemove(index)}
                disabled={checkoutState === "processing" || checkoutState === "transitioning"}
                sx={{ color: "var(--ink)" }}
              >
                ×
              </IconButton>
            </Stack>
          ))}
        </Stack>
        <Divider sx={{ borderColor: "var(--line)", my: 1.5 }} />
        <Stack direction="row" justifyContent="space-between" sx={{ py: 1.5 }}>
          <Typography variant="body2">{APP_CONFIG.productName}</Typography>
          <Typography variant="body2" fontWeight={600}>{items.length}個</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" sx={{ py: 1.5, color: "var(--muted)" }}>
          <Typography variant="body2">合計ポイント</Typography>
          <Typography variant="body2" fontWeight={600}>{points} pt</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" sx={{ borderTop: "1px solid var(--line)", pt: 1.5 }}>
          <Typography variant="body2">合計</Typography>
          <Typography variant="h2" sx={{ fontSize: 20, color: "var(--accent)" }}>
            ¥{total.toLocaleString()}
          </Typography>
        </Stack>
        {checkoutState === "success" && (
          <Alert severity="success" sx={{ mt: 1.5 }}>支払いを確認しました。ご注文ありがとうございます。</Alert>
        )}
        {checkoutState === "cancelled" && (
          <Alert severity="warning" sx={{ mt: 1.5 }}>決済はキャンセルされました。</Alert>
        )}
        {checkoutState === "error" && (
          <Alert severity="error" sx={{ mt: 1.5 }}>決済を開始できませんでした。サーバー設定を確認して再試行してください。</Alert>
        )}
        <Button
          fullWidth
          variant="contained"
          disabled={checkoutState === "processing" || checkoutState === "transitioning" || items.length < 1}
          onClick={onCheckout}
          sx={{
            mt: 1.5,
            mb: 1.5,
            backgroundColor: "var(--accent)",
            "&:hover": { backgroundColor: "var(--accent-dark)" }
          }}
        >
          {buttonLabel}
        </Button>
        <Typography variant="caption" sx={{ display: "block", color: "var(--muted)" }}>
          Stripeのテストモードを使用しています。カード情報はこのサイトでは扱いません。
        </Typography>
      </CardContent>
    </Card>
  );
}
