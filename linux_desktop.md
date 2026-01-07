# Linux Desktop Task Breakdown (Wayland-first)

## Context / Constraints
- iMessage is not supported on Linux and should be omitted.
- Wayland support at launch; X11 can follow later.
- Manual download/update flow is acceptable for v1.
- Gateway discovery is out of scope for v1; use manual IP/SSH target entry.
- Goal: “all desktops” support where reasonable; avoid DE-specific-only solutions.

## UI Stack Decision (Recommendation + Rationale)
**Recommendation:** Qt 6 (C++/QML) or Electron/Tauri.

- **Qt 6 (QML):**
  - Pros: Strong Wayland support, native look on KDE/GNOME, system tray support (StatusNotifierItem), high performance.
  - Cons: Separate codebase, higher C++/QML expertise required, packaging can be heavier.
- **Electron/Tauri:**
  - Pros: Faster iteration, shared web UI stack, easier cross‑desktop behavior, great tooling.
  - Cons: Tray + Wayland quirks, heavier runtime, potential input/permission friction.

**Actionable decision:**
- If team prefers native + Wayland stability → **Qt 6**.
- If team prefers rapid iteration + shared web UI → **Electron/Tauri**.

This doc assumes **Electron/Tauri‑style architecture**, but tasks are written so they map to Qt as well.

---

## Milestone 0 — Foundations (Project Setup)
1. **App skeleton + packaging**
   - Create Linux app entry in repo (e.g. `apps/linux/`).
   - Scaffold project with tray support and settings window.
   - Build system: `pnpm` script or separate build with `apps/linux` tooling.

2. **System integration**
   - Create `.desktop` file and icon.
   - Autostart entry for GUI app.
   - Systemd user unit template for gateway autostart in local mode.

3. **Config locations**
   - Use `~/.clawdbot/` for config + credentials.
   - Use `~/.local/share/clawdbot/` for runtime data (canvas, logs if desired).

---

## Milestone 1 — MVP (Core Control + Settings)

### 1. Tray Applet & Main Menu
- **Tray icon** with statuses (idle/working/paused/sleeping).
- **Left click:** open chat panel (or window fallback).
- **Right click:** menu with toggles + actions:
  - Toggle active/pause
  - Toggle heartbeats
  - Toggle browser control
  - Toggle allow camera
  - Toggle allow canvas
  - Toggle voice wake
  - Toggle talk mode
  - Open Dashboard
  - Open Chat
  - Open/Close Canvas (if enabled)
  - Settings…
  - About
  - Quit

### 2. Settings Window (Tabs)
- Tabs: General, Connections, Config, Instances, Sessions, Permissions, About.
- **General tab:**
  - Connection mode: Local/Remote/Unconfigured
  - Launch at login
  - “Show in app switcher” (Dock icon equivalent)
  - Allow Canvas / Camera
  - Location mode (if supported)
  - Enable debug tools toggle
- **Config tab:**
  - Model selection + manual override
  - Heartbeat schedule + message
  - Browser control settings (enabled + URL + attach‑only)

### 3. Gateway Control
- Local mode:
  - Gateway version checks and status
  - Launch gateway via systemd user unit
  - Attach to existing gateway (config toggle)
- Remote mode:
  - SSH target + identity file
  - Advanced: project root + CLI path
  - “Test remote” and surface status

### 4. Connections (WhatsApp, Telegram, Discord)
- WhatsApp: show QR, relink, logout
- Telegram: token, allowlist, require mention, webhook config, proxy
- Discord: token, DM/group settings, limits, slash config, permissions

### 5. Permissions (Wayland‑first)
- Permissions checklist with status + “Grant” guidance:
  - Notifications
  - Screen capture (xdg‑desktop‑portal)
  - Microphone
  - Camera
  - Accessibility/Automation (if needed)
  - Location (if supported)
- Add test buttons to confirm access when possible.

### 6. Basic Diagnostics
- Health check status
- Log folder open
- CLI helper status

---

## Milestone 2 — Chat + Canvas Parity

### 1. Web Chat UI
- Chat window (full size) and panel anchored to tray.
- Session key caching + default session.

### 2. Canvas Panel
- Panel anchored to tray icon or cursor.
- Session‑scoped folder for canvas content.
- Show/hide canvas and auto‑navigate to gateway A2UI URL.
- Debug operations: JS eval + snapshot.

---

## Milestone 3 — Voice & Talk Mode

### 1. Voice Wake
- Mic picker and locale selector.
- Live meter.
- Trigger words table with add/remove.
- Chime selection (trigger/send).
- Test mode with timeout + status feedback.

### 2. Push‑to‑Talk Hotkey
- Global hotkey (default: Right Alt or configurable).
- Overlay UI to indicate listening state.

### 3. Talk Mode
- Speech recognition + TTS playback.
- Interrupt‑on‑speech option.
- Voice/model selection + API key setting.

---

## Milestone 4 — Skills, Cron, Instances/Sessions Parity

### 1. Skills
- List skills with status filters (ready/needs setup/disabled).
- Enable/disable, install to local/gateway.
- Env var editor.

### 2. Cron Jobs
- Jobs list, create/edit/delete, run history.
- “Scheduler disabled” banner with guidance.

### 3. Sessions/Instances
- Sessions list with token usage, model, session ID.
- Instances list with presence, platform, version, IP, mode.
- “Copy debug summary” action for instances.

---

## Milestone 5 — Diagnostics & Debug Tools

- Debug tab (gated by toggle):
  - Gateway status, attach‑existing toggle
  - Ports check + kill confirmation
  - Tunnel reset (if supported)
  - Verbose + file logging toggles
  - Canvas debug actions
- Menu debug submenu in tray.

---

## Implementation Tasks (Detailed)

### A) Linux App Framework
- Choose UI stack (Qt 6 vs Electron/Tauri).
- Implement system tray and menu.
- Create settings window with tabbed navigation.
- App state management (mirror `AppState` behavior).

### B) Gateway Integration Layer
- Reuse existing gateway IPC/control channel code from `src/`.
- Implement local gateway start/stop + status probe.
- SSH remote test and config persistence.
- Toggle heartbeats and browser control via gateway config.

### C) Settings UI
- General tab: connection mode, autostart, dock/app‑switcher preference, debug toggle.
- Config tab: model, heartbeat, browser, talk mode settings.
- Connections tab: provider forms + save + logout flow.
- Permissions tab: status list + instructions + refresh.

### D) Chat & Canvas
- Embed web UI for chat + canvas (reuse existing web UI if available).
- Session routing and “open dashboard” integration.
- Canvas filesystem management and A2UI auto‑nav.

### E) Voice System
- Decide on speech stack (e.g. Vosk, Whisper, or system APIs).
- Implement mic enumeration and RMS meter.
- Persist trigger words + locale.
- Hotkey registration across Wayland (xdg‑portal shortcuts where possible).

### F) Skill/Cron/Session/Instance APIs
- Wire API calls to the gateway endpoints.
- Build UI lists and detail panels.

### G) Packaging & Distribution
- Build artifacts per distro (AppImage + tarball as baseline).
- Include desktop file + icons.

---

## Risks & Mitigations
- **Wayland tray support variability** → Use StatusNotifierItem and fallback window.
- **Global hotkeys on Wayland** → Use xdg‑desktop‑portal and allow user customization.
- **Screen capture permissions** → Use portal APIs and provide testing flows.
- **Electron tray issues on GNOME** → Provide fallback UI toggle (launcher window).

---

## Open Questions / Decisions Needed
- Final UI stack selection (Qt vs Electron/Tauri).
- Speech recognition engine choice for voice wake.
- Which DEs are “officially supported” at launch.
- Whether to ship AppImage only or also .deb/.rpm.

---

## Suggested Phasing (Delivery Plan)
1. **MVP**: tray + settings + gateway + connections + config + permissions
2. **Parity Core**: chat + canvas + sessions + instances
3. **Voice**: voice wake + PTT + talk mode
4. **Advanced**: skills + cron + debug tools
5. **Polish**: update UX + DE compatibility fixes
