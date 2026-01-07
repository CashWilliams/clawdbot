#!/usr/bin/env bash
set -euo pipefail

# Build the Linux Tauri app bundle.
# Output: dist/linux/* (AppImage + metadata)

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
LINUX_DIR="$ROOT_DIR/apps/linux/src-tauri"
DIST_DIR="$ROOT_DIR/dist/linux"

PKG_CONFIG_PATH_DEFAULT="/usr/lib/x86_64-linux-gnu/pkgconfig:/usr/share/pkgconfig"
export PKG_CONFIG_PATH="${PKG_CONFIG_PATH_DEFAULT}:${PKG_CONFIG_PATH:-}"
export PATH="$HOME/.cargo/bin:$PATH"
export TMPDIR="${ROOT_DIR}/.tmp/tauri"

mkdir -p "$DIST_DIR"
mkdir -p "$TMPDIR"

( cd "$LINUX_DIR" && cargo tauri build )

BUNDLE_DIR="$LINUX_DIR/target/release/bundle"
if [[ ! -d "$BUNDLE_DIR" ]]; then
  echo "ERROR: missing bundle output at $BUNDLE_DIR" >&2
  exit 1
fi

rm -rf "$DIST_DIR"/*
cp -R "$BUNDLE_DIR"/* "$DIST_DIR"/

echo "Linux bundles copied to $DIST_DIR"
