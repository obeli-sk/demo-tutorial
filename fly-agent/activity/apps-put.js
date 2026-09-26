// demo:fly-agent/apps.put: func(org-slug: string, app-name: string) -> result<record { name: string, id: string }, string>
import { safePart, flyRequest, fail } from "./fly-api.js";

export default async function put(org_slug, app_name) {
    safePart(org_slug);
    safePart(app_name);
    const response = await flyRequest("POST", "/apps", { app_name, org_slug });
    if (response.ok) {
        const app = await response.json();
        return { name: app_name, id: app.id };
    }
    if (response.status === 422) {
        const existing = await flyRequest("GET", `/apps/${app_name}`);
        if (existing.ok) {
            const app = await existing.json();
            if (app.organization.slug === org_slug) {
                return { name: app.name, id: app.id };
            }
            throw `app '${app_name}' already exists in organization '${app.organization.slug}', not '${org_slug}'`;
        }
    }
    await fail(response);
}
