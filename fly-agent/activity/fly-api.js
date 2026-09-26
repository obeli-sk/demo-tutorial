const API_BASE_URL = "https://api.machines.dev/v1";

export function safePart(value) {
    if (/[^A-Za-z0-9_-]/.test(value)) throw `illegal URL character in ${value}`;
    return value;
}

export async function flyRequest(method, path, payload) {
    const token = process.env.FLY_API_TOKEN;
    if (!token) throw "FLY_API_TOKEN secret is unavailable";
    const headers = { Authorization: `Bearer ${token}` };
    const options = { method, headers };
    if (payload !== undefined) {
        headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(payload);
    }
    return fetch(`${API_BASE_URL}${path}`, options);
}

export async function fail(response) {
    throw `Fly API ${response.status}: ${await response.text()}`;
}
