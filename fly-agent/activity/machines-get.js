// demo:fly-agent/machines.get: func(app-name: string, machine-id: string) -> result<option<record { state: string }>, string>
import { safePart, flyRequest, fail } from "./fly-api.js";

export default async function get(app_name, machine_id) {
    safePart(app_name);
    safePart(machine_id);
    const response = await flyRequest("GET", `/apps/${app_name}/machines/${machine_id}`);
    if (response.status === 404) return null;
    if (!response.ok) await fail(response);
    const machine = await response.json();
    return { state: machine.state };
}
