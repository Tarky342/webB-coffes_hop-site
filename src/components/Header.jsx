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
        <Box>
          <Typography
            variant="overline"
            sx={{ color: "var(--muted)", fontFamily: '"DM Mono", monospace', letterSpacing: ".14em" }}
          >
            A1011
          </Typography>
          <Typography variant="h1" sx={{ fontSize: 26, lineHeight: 1.2, letterSpacing: "-.04em" }}>
            Coffee <Box component="em" sx={{ color: "var(--accent)" }}>Explorer</Box>
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconButton
          onClick={onThemeToggle}
          aria-label={`テーマを${theme === "light" ? "ダーク" : "ライト"}に変更`}
            sx={{ border: "1px solid var(--line)", color: "var(--ink)", borderRadius: "50%" }}
        >
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
