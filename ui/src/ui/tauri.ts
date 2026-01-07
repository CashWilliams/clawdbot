export type TauriInvoke = <T>(cmd: string, args?: Record<string, unknown>) => Promise<T>;

type TauriGlobal = {
  invoke?: TauriInvoke;
};

function getTauri(): TauriGlobal | null {
  if (typeof window === "undefined") return null;
  const host = window as Window & { __TAURI__?: TauriGlobal };
  return host.__TAURI__ ?? null;
}

export function hasTauri(): boolean {
  return Boolean(getTauri()?.invoke);
}

export async function invokeTauri<T>(cmd: string, args?: Record<string, unknown>): Promise<T> {
  const invoke = getTauri()?.invoke;
  if (!invoke) {
    throw new Error("Tauri bridge not available");
  }
  return invoke<T>(cmd, args);
}
