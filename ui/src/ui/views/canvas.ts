import { html } from "lit";

export type CanvasProps = {
  connected: boolean;
  gatewayUrl: string;
};

function toHttpBase(gatewayUrl: string): string | null {
  if (!gatewayUrl) return null;
  try {
    const url = new URL(gatewayUrl);
    if (url.protocol === "ws:") url.protocol = "http:";
    if (url.protocol === "wss:") url.protocol = "https:";
    url.pathname = "";
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}

export function renderCanvas(props: CanvasProps) {
  const base = toHttpBase(props.gatewayUrl);
  const canvasUrl = base ? `${base}/__clawdbot__/a2ui/` : null;

  return html`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Canvas</div>
          <div class="card-sub">A2UI canvas session hosted by the gateway.</div>
        </div>
        ${canvasUrl
          ? html`<a class="btn" href=${canvasUrl} target="_blank" rel="noreferrer">
              Open in Browser
            </a>`
          : html`<span class="muted">Set a valid gateway URL.</span>`}
      </div>

      ${props.connected && canvasUrl
        ? html`<div class="canvas-frame" style="margin-top: 16px;">
            <iframe
              title="Clawdbot Canvas"
              src=${canvasUrl}
              style="width: 100%; height: 70vh; border: 0;"
            ></iframe>
          </div>`
        : html`<div class="callout" style="margin-top: 16px;">
            Connect to the gateway to load the canvas.
          </div>`}
    </section>
  `;
}
