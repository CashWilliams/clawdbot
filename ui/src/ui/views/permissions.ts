import { html } from "lit";

export type PermissionsProps = {
  onRefresh: () => void;
};

const PERMISSIONS = [
  {
    name: "Notifications",
    detail: "Desktop notifications for gateway events and errors.",
    guidance:
      "Enable notifications for Clawdbot in your desktop settings or notification center.",
  },
  {
    name: "Screen capture",
    detail: "Required for screenshots and browser control on Wayland.",
    guidance:
      "Grant screen capture access when prompted by xdg-desktop-portal.",
  },
  {
    name: "Microphone",
    detail: "Used for voice wake and talk mode.",
    guidance:
      "Allow microphone access when prompted by your desktop environment.",
  },
  {
    name: "Camera",
    detail: "Used for camera input and remote capture.",
    guidance:
      "Allow camera access when prompted by your desktop environment.",
  },
  {
    name: "Accessibility",
    detail: "Needed for automation hooks (keyboard/mouse) when enabled.",
    guidance:
      "Allow accessibility/remote control in your desktop security settings.",
  },
  {
    name: "Location",
    detail: "Optional; only used when location features are enabled.",
    guidance:
      "Allow location access if you want geofenced automations.",
  },
];

export function renderPermissions(props: PermissionsProps) {
  return html`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Permissions</div>
          <div class="card-sub">Wayland-first permission checklist.</div>
        </div>
        <button class="btn" @click=${props.onRefresh}>Refresh</button>
      </div>
      <div class="grid grid-cols-2" style="margin-top: 16px;">
        ${PERMISSIONS.map(
          (perm) => html`
            <div class="card" style="margin: 0;">
              <div class="row" style="justify-content: space-between;">
                <div class="card-title">${perm.name}</div>
                <span class="pill">Manual</span>
              </div>
              <div class="muted" style="margin-top: 8px;">${perm.detail}</div>
              <div class="callout" style="margin-top: 12px;">${perm.guidance}</div>
            </div>
          `,
        )}
      </div>
    </section>
  `;
}
