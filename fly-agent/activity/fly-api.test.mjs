import test from "node:test";
import assert from "node:assert/strict";
import put from "./apps-put.js";
import deleteApp from "./apps-delete.js";
import create from "./machines-create.js";
import get from "./machines-get.js";
import exec from "./machines-exec.js";

process.env.FLY_API_TOKEN = "opaque-placeholder";

function mockFetch(replies) {
    const calls = [];
    globalThis.fetch = async (url, options) => {
        calls.push({ url, options });
        const reply = replies.shift();
        assert.ok(reply, `unexpected request: ${url}`);
        return new Response(reply.body === undefined ? null : JSON.stringify(reply.body), {
            status: reply.status,
        });
    };
    return calls;
}

test("app creation accepts an existing app only in the requested organization", async () => {
    const calls = mockFetch([
        { status: 422, body: { error: "taken" } },
        { status: 200, body: { id: "app-id", name: "agent", organization: { slug: "my-org" } } },
    ]);
    assert.deepEqual(await put("my-org", "agent"), { name: "agent", id: "app-id" });
    assert.equal(calls[0].options.headers.Authorization, "Bearer opaque-placeholder");
    assert.equal(calls[1].url, "https://api.machines.dev/v1/apps/agent");

    mockFetch([
        { status: 422, body: { error: "taken" } },
        { status: 200, body: { id: "app-id", name: "agent", organization: { slug: "other-org" } } },
    ]);
    await assert.rejects(put("my-org", "agent"), /other-org/);
});

test("app deletion treats an already-deleted app as success", async () => {
    const calls = mockFetch([{ status: 404 }]);
    await deleteApp("agent", true);
    assert.equal(calls[0].url, "https://api.machines.dev/v1/apps/agent?force=true");
    assert.equal(calls[0].options.method, "DELETE");
});

test("machine creation serializes environment and reuses a conflicting machine ID", async () => {
    const calls = mockFetch([{ status: 409, body: {
        error: "already_exists: unique machine name violation, machine ID m-123 already exists with name agent-vm",
    } }]);
    const config = JSON.stringify({ image: "alpine:3.21", env: [["PROMPT", "hello"]] });
    assert.equal(await create("agent", "agent-vm", config, "ams"), "m-123");
    assert.deepEqual(JSON.parse(calls[0].options.body), {
        name: "agent-vm", config: { image: "alpine:3.21", env: { PROMPT: "hello" } }, region: "ams",
    });
});

test("machine get returns null on 404", async () => {
    mockFetch([{ status: 404 }]);
    assert.equal(await get("agent", "m-123"), null);
});

test("machine exec sends Fly's timeout field and returns exit status", async () => {
    const calls = mockFetch([{ status: 200, body: {
        exit_code: 1, exit_signal: null, stderr: "not ready", stdout: "",
    } }]);
    assert.deepEqual(await exec("agent", "m-123", ["cat", "/result.txt"], 10), {
        exit_code: 1, exit_signal: null, stderr: "not ready", stdout: "",
    });
    assert.deepEqual(JSON.parse(calls[0].options.body), {
        command: ["cat", "/result.txt"], timeout: 10, stdin: null,
    });
});
