use serde::Serialize;
use std::process::Command;

#[derive(Serialize)]
pub struct SystemdResult {
    pub ok: bool,
    pub stdout: String,
    pub stderr: String,
    pub code: i32,
}

fn run_systemctl(args: &[&str]) -> Result<SystemdResult, String> {
    let output = Command::new("systemctl")
        .args(args)
        .output()
        .map_err(|err| err.to_string())?;
    let stdout = String::from_utf8_lossy(&output.stdout).trim_end().to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).trim_end().to_string();
    Ok(SystemdResult {
        ok: output.status.success(),
        stdout,
        stderr,
        code: output.status.code().unwrap_or(-1),
    })
}

const GATEWAY_UNIT: &str = "clawdbot-gateway.service";

#[tauri::command]
pub fn gateway_service_status() -> Result<SystemdResult, String> {
    run_systemctl(&["--user", "is-active", GATEWAY_UNIT])
}

#[tauri::command]
pub fn gateway_service_start() -> Result<SystemdResult, String> {
    run_systemctl(&["--user", "start", GATEWAY_UNIT])
}

#[tauri::command]
pub fn gateway_service_stop() -> Result<SystemdResult, String> {
    run_systemctl(&["--user", "stop", GATEWAY_UNIT])
}

#[tauri::command]
pub fn gateway_service_restart() -> Result<SystemdResult, String> {
    run_systemctl(&["--user", "restart", GATEWAY_UNIT])
}
