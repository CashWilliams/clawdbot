import type { GatewayBrowserClient } from "../gateway";

export type VoiceWakeState = {
  client: GatewayBrowserClient | null;
  connected: boolean;
  voiceWakeLoading: boolean;
  voiceWakeSaving: boolean;
  voiceWakeTriggers: string[];
  voiceWakeStatus: string | null;
  voiceWakeError: string | null;
};

type VoiceWakeResult = { triggers?: string[] };

export async function loadVoiceWake(state: VoiceWakeState) {
  if (!state.client || !state.connected) return;
  state.voiceWakeLoading = true;
  state.voiceWakeError = null;
  try {
    const result = await state.client.request<VoiceWakeResult>("voicewake.get");
    state.voiceWakeTriggers = Array.isArray(result.triggers) ? result.triggers : [];
  } catch (err) {
    state.voiceWakeError = err instanceof Error ? err.message : String(err);
  } finally {
    state.voiceWakeLoading = false;
  }
}

export async function saveVoiceWake(state: VoiceWakeState) {
  if (!state.client || !state.connected) return;
  state.voiceWakeSaving = true;
  state.voiceWakeError = null;
  state.voiceWakeStatus = null;
  try {
    const result = await state.client.request<VoiceWakeResult>("voicewake.set", {
      triggers: state.voiceWakeTriggers,
    });
    state.voiceWakeTriggers = Array.isArray(result.triggers) ? result.triggers : [];
    state.voiceWakeStatus = "Saved.";
  } catch (err) {
    state.voiceWakeError = err instanceof Error ? err.message : String(err);
  } finally {
    state.voiceWakeSaving = false;
  }
}
