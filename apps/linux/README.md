# Clawdbot Linux (Tauri)

This is the Linux desktop app shell using Tauri and the shared control UI in `ui/`.

## Decisions

- Tauri was chosen for multi-desktop environment support while keeping the existing web UI stack.
- Wayland-first behavior with systemd user services for gateway control.
- AppImage is the baseline packaging target (manual download/update flow for now).

## Prerequisites

- Node 22+ (pnpm or bun in PATH).
- Rust toolchain with `cargo tauri`.
- GTK/WebKit dependencies (Ubuntu/Debian example):
  - `sudo apt-get install -y pkg-config libglib2.0-dev libgtk-3-dev libcairo2-dev libpango1.0-dev libgdk-pixbuf-2.0-dev libatk1.0-dev`

## Dev

From repo root:

- UI dev server: `pnpm ui:dev`

From `apps/linux/src-tauri`:

- `PKG_CONFIG_PATH="/usr/lib/x86_64-linux-gnu/pkgconfig:/usr/share/pkgconfig:$PKG_CONFIG_PATH" cargo tauri dev`

The Tauri app loads the Vite dev server at `http://localhost:5173`.

## Build + Package

From repo root:

- `scripts/package-linux-app.sh`

This runs `pnpm ui:build`, builds the Tauri app, and copies bundles to `dist/linux`.

Notes:

- The build outputs the UI to `dist/control-ui` and the Tauri app uses that directory.
- AppImage bundling downloads `linuxdeploy`/AppRun tools from GitHub on first run. This requires outbound network access or a pre-seeded tool cache. If you see `Permission denied (os error 13)` during bundling in a sandboxed environment, re-run on a machine with network access or pre-populate the cache.

## Install + System Integration

From repo root:

- `apps/linux/packaging/install.sh` (installs desktop entry, autostart entry, systemd user unit)
- `apps/linux/packaging/uninstall.sh`

## Config Paths

- Config: `~/.clawdbot/`
- Runtime data: `~/.local/share/clawdbot/`
