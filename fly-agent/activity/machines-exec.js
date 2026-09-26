// demo:fly-agent/machines.exec: func(app-name: string, machine-id: string, command: list<string>, timeout-secs: u16) -> result<record { exit-code: option<s32>, exit-signal: option<s32>, stderr: option<string>, stdout: option<string> }, string>
import { safePart, flyRequest, fail } from "./fly-api.js";

export default async function exec(app_name, machine_id, command, timeout_secs) {
    safePart(app_name);
    safePart(machine_id);
    const response = await flyRequest("POST", `/apps/${app_name}/machines/${machine_id}/exec`, {
        command, timeout: timeout_secs, stdin: null,
    });
    if (!response.ok) await fail(response);
    const result = await response.json();
    return {
        exit_code: result.exit_code ?? null,
        exit_signal: result.exit_signal ?? null,
        stderr: result.stderr ?? null,
        stdout: result.stdout ?? null,
    };
}
