import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Link,
  Stack,
  Typography
} from "@mui/material";
import { MAP_CONFIG } from "../lib/config.js";
import { formatProduction, hasProductionData } from "../lib/origins.js";
import { CountryFlag } from "./CountryFlag.jsx";

export function OriginDetailsModal({ origin, onClose, onAddToBlend }) {
  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="origin-title"
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "var(--panel)",
            color: "var(--ink)",
            backgroundImage: "none"
          }
        }
      }}
    >
      <DialogTitle id="origin-title" sx={{ pb: 1 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <CountryFlag countryId={origin.id} countryName={origin.name} />
          <Typography component="span" variant="h2" sx={{ fontSize: 38 }}>
            {origin.name}
          </Typography>
        </Stack>
        <Typography variant="overline" sx={{ color: "var(--muted)", fontFamily: '"DM Mono", monospace' }}>
          {origin.nameEn || origin.id}
        </Typography>
      </DialogTitle>
      <DialogContent dividers sx={{ borderColor: "var(--line)" }}>
        <Typography sx={{ color: "var(--muted)", lineHeight: 1.8, mb: 3 }}>
          {origin.overview || "この産地の概要は準備中です。"}
        </Typography>
        <Stack direction="row" spacing={5} sx={{ mb: 3 }}>
          <BoxDetail label="地域" value={origin.region || "情報がないようです :("} />
        </Stack>
        <Stack spacing={1.5} sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: "var(--muted)" }}>生豆生産量</Typography>
          <Typography variant="body2">{formatProduction(origin, MAP_CONFIG.production)}</Typography>
          {hasProductionData(origin) && (
            <Typography variant="caption">
              出典: <Link href={MAP_CONFIG.production.sourceUrl} target="_blank" rel="noreferrer" color="inherit">FAOSTAT / Invokely</Link>
            </Typography>
          )}
        </Stack>
        {origin.flavorNotes?.length > 0 && (
          <Stack
            direction="row"
            spacing={.75}
            useFlexGap
            sx={{ flexWrap: "wrap" }}
            aria-label="フレーバーノート"
          >
            {origin.flavorNotes.map((note) => (
              <Chip key={note} label={note} variant="outlined" size="small" sx={{ color: "var(--muted)", borderColor: "var(--line)" }} />
            ))}
          </Stack>
        )}
        <Divider sx={{ borderColor: "var(--line)", my: 3 }} />
        <Typography variant="caption" sx={{ color: "var(--muted)" }}>
          学習用データ: {origin.dataStatus || "参考資料に基づく学習用データ"}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button variant="contained" onClick={() => onAddToBlend(origin)} sx={{ backgroundColor: "var(--accent)" }}>
          ブレンドに追加
        </Button>
        <Button variant="outlined" onClick={onClose} sx={{ color: "var(--ink)", borderColor: "var(--line)" }}>
          閉じる
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function BoxDetail({ label, value }) {
  return (
    <Stack spacing={.5}>
      <Typography variant="caption" sx={{ color: "var(--muted)" }}>{label}</Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  );
}
