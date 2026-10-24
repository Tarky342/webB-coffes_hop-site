import { fontSizeToCSS } from "@amcharts/amcharts5/.internal/core/render/scene/TextLayout";
import { AppBar, Box, Chip, IconButton, Stack, Toolbar, Typography } from "@mui/material";

export function Header({ theme, score, cartQuantity, onThemeToggle }) {
  return (
    <AppBar
      component="header"
      position="static"
      elevation={0}
      sx={{ background: "transparent", color: "var(--ink)", mb: 2.5 }}
    >
      <Toolbar disableGutters sx={{ justifyContent: "space-between", minHeight: "auto", py: 1 }}>
        <Box sx={{ minWidth: 0, maxWidth: 760 }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: 22, sm: 28 },
              lineHeight: 1.25,
              letterSpacing: "-.04em",
              mb: 1.25
            }}
          >
            国を選んで、あなただけのオリジナルブレンドコーヒーを作る体験をお楽しみください。
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.8 }}
          >
            ※本サイトは、コーヒーのブレンドづくりを疑似体験するためのコンテンツです。選択した国と、表示されるコーヒーの品種・農園・ブランドとの組み合わせは、実際の産地や所在地、生産上の関係性に基づくものではありません。あくまで体験を目的としたものであり、実際のコーヒーに関する情報を正確に再現するものではないことをご了承ください。
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <IconButton
          onClick={onThemeToggle}
          aria-label={`テーマを${theme === "light" ? "ダーク" : "ライト"}に変更`}
            sx={{  color: "var(--ink)", borderRadius: "50%" }}
        >
          <p className="">{theme === "light" ? "light" : "dark"}</p>
          {theme === "light" ? "☼" : "☾"}
          </IconButton>
          <Chip
            label={`✦ ${score} pt`}
            aria-label={`豆ポイント ${score}`}
            variant="outlined"
            sx={{ color: "var(--accent)", borderColor: "var(--line)" }}
          />
          <Chip
            label={`🛒 ${cartQuantity}`}
            aria-label={`カート ${cartQuantity}個`}
            sx={{
              backgroundColor: cartQuantity ? "var(--ink)" : "transparent",
              color: cartQuantity ? "var(--bg)" : "var(--ink)",
              border: "1px solid var(--line)"
            }}
          />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
