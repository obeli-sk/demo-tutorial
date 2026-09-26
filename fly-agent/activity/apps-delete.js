// demo:fly-agent/apps.delete: func(app-name: string, force: bool) -> result<_, string>
import { safePart, flyRequest, fail } from "./fly-api.js";

export default async function delete_app(app_name, force) {
    safePart(app_name);
    const path = `/apps/${app_name}${force ? "?force=true" : ""}`;
    const response = await flyRequest("DELETE", path);
    if (!response.ok && response.status !== 404) await fail(response);
}
