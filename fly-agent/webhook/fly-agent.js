// Webhook endpoint: triggers the fly-agent saga via HTTP.
//
// Route: /run/:org-slug/:app-name/:prompt
//
// Usage:
//   curl http://localhost:9090/run/personal/my-unique-app/what-is-42
export default function handle(_request) {
    const org_slug = process.env['org-slug'];
    const app_name = process.env['app-name'];
    const prompt = process.env['prompt'];

    console.log(`Starting saga: org=${org_slug}, app=${app_name}, prompt=${prompt}`);
    const headers = { "x-obelisk-execution-id": obelisk.executionIdCurrent() };
    try {
        const result = obelisk.call("demo:fly-agent/workflow.run", [app_name, org_slug, prompt]);
        return new Response(`Agent completed:\n${result}\n`, { status: 200, headers });
    } catch (e) {
        return new Response(`Agent failed: ${e}\n`, { status: 500, headers });
    }
}
