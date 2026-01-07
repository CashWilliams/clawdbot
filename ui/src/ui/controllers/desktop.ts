import { invokeTauri } from "../tauri";

export type DesktopState = {
  tauriAvailable: boolean;
  gatewayServiceStatus: string | null;
  gatewayServiceBusy: boolean;
  gatewayServiceError: string | null;
};

type SystemdResult = {
  ok: boolean;
  stdout: string;
  stderr: string;
  code: number | null;
};

function normalizeStatus(result: SystemdResult): string {
  const trimmed = result.stdout.trim();
  if (trimmed) return trimmed;
  return result.ok ? "active" : "inactive";
}

export async function refreshGatewayServiceStatus(state: DesktopState) {
  if (!state.tauriAvailable) return;
  state.gatewayServiceBusy = true;
  state.gatewayServiceError = null;
  try {
    const result = await invokeTauri<SystemdResult>("gateway_service_status");
    state.gatewayServiceStatus = normalizeStatus(result);
    if (!result.ok && result.stderr.trim()) {
      state.gatewayServiceError = result.stderr.trim();
    }
  } catch (err) {
    state.gatewayServiceError = err instanceof Error ? err.message : String(err);
  } finally {
    state.gatewayServiceBusy = false;
  }
}

export async function runGatewayServiceAction(
  state: DesktopState,
  action: "start" | "stop" | "restart",
) {
  if (!state.tauriAvailable) return;
  state.gatewayServiceBusy = true;
  state.gatewayServiceError = null;
  try {
    await invokeTauri<SystemdResult>(`gateway_service_${action}`);
  } catch (err) {
    state.gatewayServiceError = err instanceof Error ? err.message : String(err);
  } finally {
    state.gatewayServiceBusy = false;
  }
  await refreshGatewayServiceStatus(state);
}
