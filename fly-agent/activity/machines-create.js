// demo:fly-agent/machines.create: func(app-name: string, machine-name: string, machine-config-json: string, region: string) -> result<string, string>
import { safePart, flyRequest, fail } from "./fly-api.js";

export default async function create(app_name, machine_name, machine_config_json, region) {
    safePart(app_name);
    const config = JSON.parse(machine_config_json);
    if (config.env !== null && config.env !== undefined) {
        config.env = Object.fromEntries(config.env);
    }
    const response = await flyRequest("POST", `/apps/${app_name}/machines`, {
        name: machine_name, config, region,
    });
    if (response.ok) return (await response.json()).id;
    if (response.status === 409) {
        const { error } = await response.json();
        const prefix = "already_exists: unique machine name violation, machine ID ";
        const suffix = " already exists with name ";
        if (typeof error === "string" && error.startsWith(prefix)) {
            const end = error.indexOf(suffix, prefix.length);
            if (end > prefix.length) return error.slice(prefix.length, end);
        }
        throw `cannot parse machine ID from 409 response: ${error}`;
    }
    await fail(response);
}
