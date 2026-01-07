import { html, nothing } from "lit";

export type VoiceProps = {
  connected: boolean;
  loading: boolean;
  saving: boolean;
  triggers: string[];
  input: string;
  status: string | null;
  error: string | null;
  onInputChange: (next: string) => void;
  onAddTrigger: () => void;
  onRemoveTrigger: (trigger: string) => void;
  onRefresh: () => void;
  onSave: () => void;
};

export function renderVoice(props: VoiceProps) {
  const disabled = !props.connected || props.loading || props.saving;

  return html`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Voice Wake</div>
          <div class="card-sub">Wake triggers stored in ~/.clawdbot/settings/voicewake.json.</div>
        </div>
        <div class="row">
          <button class="btn" ?disabled=${props.loading} @click=${props.onRefresh}>
            ${props.loading ? "Refreshing…" : "Refresh"}
          </button>
          <button class="btn primary" ?disabled=${disabled} @click=${props.onSave}>
            ${props.saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div class="form-grid" style="margin-top: 16px;">
        <label class="field" style="grid-column: 1 / -1;">
          <span>Add trigger</span>
          <div class="row" style="gap: 8px;">
            <input
              .value=${props.input}
              ?disabled=${disabled}
              @input=${(e: Event) =>
                props.onInputChange((e.target as HTMLInputElement).value)}
              placeholder="Hey Clawdbot"
            />
            <button class="btn" ?disabled=${disabled} @click=${props.onAddTrigger}>
              Add
            </button>
          </div>
        </label>
      </div>

      <div class="row" style="flex-wrap: wrap; gap: 8px; margin-top: 12px;">
        ${props.triggers.length === 0
          ? html`<span class="muted">No triggers configured.</span>`
          : props.triggers.map(
              (trigger) => html`
                <span class="pill">
                  <span>${trigger}</span>
                  <button
                    class="btn"
                    ?disabled=${disabled}
                    @click=${() => props.onRemoveTrigger(trigger)}
                  >
                    Remove
                  </button>
                </span>
              `,
            )}
      </div>

      ${props.status
        ? html`<div class="callout" style="margin-top: 12px;">${props.status}</div>`
        : nothing}
      ${props.error
        ? html`<div class="callout danger" style="margin-top: 12px;">${props.error}</div>`
        : nothing}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Talk Mode</div>
      <div class="card-sub">
        Talk mode controls live in the gateway config. Use the Config tab to set voice IDs
        and talk mode preferences.
      </div>
      <div class="callout" style="margin-top: 12px;">
        Linux voice wake capture and hotkey support will be wired through portals.
      </div>
    </section>
  `;
}
