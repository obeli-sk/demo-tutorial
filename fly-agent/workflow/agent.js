// ffqn: demo:fly-agent/workflow.agent(app-name: string, org-slug: string, prompt: string) -> result<string, string>
//
// Inner workflow: creates a fly.io app, launches a VM that runs the agent
// in the background and writes the result to /result.txt, then polls until
// the file appears. Does NOT delete the app.
export default function agent(app_name, org_slug, prompt) {
    // Step 1: Create the fly.io app.
    console.log(`Creating app: ${app_name}`);
    obelisk.call("obelisk-flyio:activity-fly-http/apps@1.0.0-beta.put", [org_slug, app_name]);

    // Step 2: Launch a VM.
    // The init command runs the agent in the background and writes the result
    // to /result.txt. The foreground `sleep 3600` keeps the VM alive so we can
    // read the file via exec.
    // Replace the backgrounded command with your actual agent entrypoint.
    console.log("Launching VM");
    const machine_id = obelisk.call("obelisk-flyio:activity-fly-http/machines@1.0.0-beta.create", [
        app_name,
        "agent-vm",
        {
            image: "alpine:3.21",
            guest: { cpu_kind: "shared", cpus: 1, memory_mb: 256, kernel_args: null },
            auto_destroy: null,
            init: {
                entrypoint: null,
                cmd: [
                    "/bin/sh", "-c",
                    '(sleep 60 && printf "Prompt: %s\\nResult: %s\\n" "$PROMPT" "42 is the answer" > /result.txt) & sleep 3600'
                ],
                exec: null,
                kernel_args: null,
                swap_size_mb: null,
                tty: null
            },
            env: [["PROMPT", prompt]],
            restart: { max_retries: null, policy: "no" },
            stop_config: null,
            mounts: null,
            services: null,
            files: null
        },
        "ams"
    ]);
    console.log(`VM created: ${machine_id}`);

    // Step 3: Poll until the VM reaches the 'started' state.
    let started = false;
    for (let i = 0; i < 20; i++) {
        const machine = obelisk.call(
            "obelisk-flyio:activity-fly-http/machines@1.0.0-beta.get",
            [app_name, machine_id]
        );
        if (machine !== null && machine.state === "started") { started = true; break; }
        console.log(`VM state: ${machine ? machine.state : "unknown"}, retrying in 3s`);
        obelisk.sleep({ seconds: 3 });
    }
    if (!started) throw "VM did not reach 'started' state within timeout";

    // Step 4: Poll until /result.txt appears.
    // Each exec is a fast `cat` — no fly.io timeout issues.
    // Throws if the VM becomes unreachable (e.g. stopped externally).
    let output = null;
    for (let i = 0; i < 30; i++) {
        const cat = obelisk.call(
            "obelisk-flyio:activity-fly-http/machines@1.0.0-beta.exec",
            [app_name, machine_id, ["cat", "/result.txt"], { timeout_secs: 10, stdin: null }]
        );
        if (cat.exit_code === 0) {
            output = (cat.stdout || "").trim();
            break;
        }
        console.log(`Result not ready yet (attempt ${i + 1}/30)`);
        obelisk.sleep({ seconds: 5 });
    }
    if (output === null) throw "Agent did not produce a result within timeout";

    console.log(`Agent output: ${output}`);
    return output;
}
