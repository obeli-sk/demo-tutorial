// A webhook endpoint that triggers workflows based on the request path.
// Routes /serial and /parallel to the corresponding workflow.
export default function handle(request) {
    const url = new URL(request.url);
    const path = url.pathname;
    console.log(`Handling request: ${path}`);
    const headers = { "x-obelisk-execution-id": obelisk.executionIdCurrent() };
    if (path === "/serial") {
        const result = obelisk.call("tutorial:demo/workflow.serial", []);
        return new Response(`serial workflow completed: ${result}`, { status: 200, headers });
    } else if (path === "/parallel") {
        const result = obelisk.call("tutorial:demo/workflow.parallel", []);
        return new Response(`parallel workflow completed: ${result}`, { status: 200, headers });
    } else {
        return new Response("not found\ntry /serial or /parallel", { status: 404, headers });
    }
}
