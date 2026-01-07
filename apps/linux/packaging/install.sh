#!/usr/bin/env bash
set -euo pipefail

exec_path=""
icon_path=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --exec)
      exec_path="$2"
      shift 2
      ;;
    --icon)
      icon_path="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

if [[ -z "$exec_path" ]]; then
  echo "Usage: $0 --exec /path/to/clawdbot [--icon /path/to/icon.png]" >&2
  exit 1
fi

app_dir="$HOME/.local/share/applications"
autostart_dir="$HOME/.config/autostart"
systemd_dir="$HOME/.config/systemd/user"
icon_dir="$HOME/.local/share/icons/hicolor/256x256/apps"

mkdir -p "$app_dir" "$autostart_dir" "$systemd_dir" "$icon_dir"

if [[ -n "$icon_path" ]]; then
  cp "$icon_path" "$icon_dir/clawdbot.png"
  command -v gtk-update-icon-cache >/dev/null 2>&1 && \
    gtk-update-icon-cache -f "$HOME/.local/share/icons/hicolor" >/dev/null 2>&1 || true
fi

sed "s|^Exec=.*$|Exec=${exec_path}|" \
  "$(dirname "$0")/desktop/clawdbot.desktop" \
  > "$app_dir/clawdbot.desktop"

sed "s|^Exec=.*$|Exec=${exec_path}|" \
  "$(dirname "$0")/desktop/clawdbot-autostart.desktop" \
  > "$autostart_dir/clawdbot.desktop"

cp "$(dirname "$0")/systemd/clawdbot-gateway.service" \
  "$systemd_dir/clawdbot-gateway.service"

echo "Installed desktop entries and systemd unit."
echo "Enable gateway service with: systemctl --user enable --now clawdbot-gateway.service"
