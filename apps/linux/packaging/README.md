# Linux Packaging Assets

This folder contains template assets for Linux integration.

## Desktop Entries

- `desktop/clawdbot.desktop` -> install to `~/.local/share/applications/`
- `desktop/clawdbot-autostart.desktop` -> install to `~/.config/autostart/`
 - `install.sh` can install these with a custom Exec path.

## Systemd User Unit

- `systemd/clawdbot-gateway.service` -> install to `~/.config/systemd/user/`
- Enable with `systemctl --user enable --now clawdbot-gateway.service`
 - `install.sh` and `uninstall.sh` handle copying/removal.

## Config Paths

- Config: `~/.clawdbot/`
- Runtime data: `~/.local/share/clawdbot/`

## Install Script

```
./install.sh --exec /path/to/clawdbot --icon /path/to/icon.png
```

`--icon` is optional. The icon is installed as `clawdbot.png` in the user hicolor theme.
