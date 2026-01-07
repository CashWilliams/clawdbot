#!/usr/bin/env bash
set -euo pipefail

app_dir="$HOME/.local/share/applications"
autostart_dir="$HOME/.config/autostart"
systemd_dir="$HOME/.config/systemd/user"
icon_dir="$HOME/.local/share/icons/hicolor/256x256/apps"

rm -f "$app_dir/clawdbot.desktop"
rm -f "$autostart_dir/clawdbot.desktop"
rm -f "$systemd_dir/clawdbot-gateway.service"
rm -f "$icon_dir/clawdbot.png"

echo "Removed desktop entries, systemd unit, and icon."
