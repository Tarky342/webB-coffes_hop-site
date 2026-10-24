import {
  Alert,
  Button,
  Card,
  CardContent,
  Divider,
  Autocomplete,
  IconButton,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
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
  const [expanded, setExpanded] = useState(false);
  const points = getBlendPoints(items);
  const total = getBlendPrice(points);
  const isDropdown = items.length > 4;
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
          ) : isDropdown ? (
            <Autocomplete
              multiple
              options={items}
              value={items}
              limitTags={expanded ? undefined : 4}
              disableClearable
              disableCloseOnSelect
              disabled={checkoutState === "processing" || checkoutState === "transitioning"}
              getOptionLabel={(item) => item.name || "名称未設定"}
              onChange={(_, __, reason, details) => {
                if (reason !== "removeOption" || !details?.option) return;
                const removedIndex = items.indexOf(details.option);
                if (removedIndex >= 0) onRemove(removedIndex);
              }}
              slotProps={{
                chip: {
                  onClick: () => setExpanded(true)
                },
                paper: {
                  sx: {
                    backgroundColor: "var(--panel)",
                    color: "var(--ink)"
                  }
                },
                listbox: {
                  sx: {
                    "& .MuiAutocomplete-option[aria-selected='true']": {
                      backgroundColor: "var(--bg)"
                    },
                    "& .MuiAutocomplete-option:hover": {
                      backgroundColor: "var(--line)"
                    }
                  }
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="選択した豆"
                  size="small"
                  sx={{
                    "& .MuiInputLabel-root": { color: "var(--muted)" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "var(--accent)" },
                    "& .MuiOutlinedInput-root": {
                      color: "var(--ink)",
                      "& fieldset": { borderColor: "var(--line)" },
                      "&:hover fieldset": { borderColor: "var(--ink)" },
                      "&.Mui-focused fieldset": { borderColor: "var(--accent)" }
                    }
                  }}
                />
              )}
              sx={{
                "& .MuiAutocomplete-tag": {
                  color: "var(--ink)",
                  backgroundColor: "var(--bg)",
                  border: "1px solid var(--line)"
                },
                "& .MuiAutocomplete-popupIndicator, & .MuiAutocomplete-clearIndicator": {
                  color: "var(--ink)"
                }
              }}
            />
          ) : items.map((item, index) => (
            <Stack
              key={`${item.id}-${index}`}
              direction="row"
              sx={{
                borderTop: "1px solid var(--line)",
                pt: 1,
                gap: 1,
                justifyContent: "space-between",
                alignItems: "center"
              }}
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
        <Stack direction="row" sx={{ py: 1.5, justifyContent: "space-between" }}>
          <Typography variant="body2">{APP_CONFIG.productName}</Typography>
          <Typography variant="body2" fontWeight={600}>{items.length}個</Typography>
        </Stack>
        <Stack direction="row" sx={{ py: 1.5, color: "var(--muted)", justifyContent: "space-between" }}>
          <Typography variant="body2">合計ポイント</Typography>
          <Typography variant="body2" fontWeight={600}>{points} pt</Typography>
        </Stack>
        <Stack direction="row" sx={{ borderTop: "1px solid var(--line)", pt: 1.5, justifyContent: "space-between" }}>
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
