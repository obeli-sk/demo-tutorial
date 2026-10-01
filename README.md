# Demo-tutorial

This repo contains the code used in the
[Comparing Obelisk with DBOS](http://obeli.sk/blog/comparing-dbos-part-1) blog post,
updated for Obelisk 0.42 with native JavaScript support.

The tutorial shows a **serial** and a **parallel** durable workflow,
each driving a simple `step` activity.

## JavaScript (default)

No build step required. Just install [Obelisk](https://obeli.sk/install/) and run:

```sh
export OBELISK_API_TOKEN=$(obelisk generate token)
obelisk server run --server-config server.toml --app-config app.toml --deployment deployment.toml
```

The server starts three endpoints:
- **Web UI**: http://localhost:8080
- **Webhook**: http://localhost:9090
- **API**: http://localhost:5005

Trigger the workflows:

```sh
curl http://localhost:9090/serial
curl http://localhost:9090/parallel
```

## Inspecting executions

The API port requires a token. The server above accepts the `OBELISK_API_TOKEN` exported before it
started; export the same value in the shell you query from.

List top-level executions (one per webhook call):

```sh
export OBELISK_API_AUTH="Authorization: Bearer $OBELISK_API_TOKEN"
curl -s -H "$OBELISK_API_AUTH" "http://localhost:5005/v1/executions"
```

```json
[
  {
    "execution_id": "E_01KN209P2PCVPGAPRC3DBAC92C",
    "ffqn": "wasi:http/incoming-handler.handle",
    "pending_state": { "status": "finished", "result_kind": "ok", ... },
    "created_at": "2026-03-31T13:11:01.541897881Z",
    ...
  }
]
```

Each entry has the execution ID, the FFQN (all webhooks use `wasi:http/incoming-handler.handle`),
its state, and its creation time.

Fetch logs for a webhook execution (includes its `console.log` output):

```sh
EXECUTION_ID=E_01KN209P2PCVPGAPRC3DBAC92C
curl -s -H "$OBELISK_API_AUTH" "http://localhost:5005/v1/executions/${EXECUTION_ID}/logs"
```

To see the child executions spawned by a webhook, the workflow and its activities, use
`show_derived=true`. Narrow to tutorial executions with `ffqn_prefix`:

```sh
curl -s -H "$OBELISK_API_AUTH" "http://localhost:5005/v1/executions?show_derived=true&ffqn_prefix=tutorial:demo"
```

The CLI reads the same token, so `obelisk execution list` prints a compact summary.

Then fetch logs for any individual execution by its ID. `console.log` calls in workflows
and activities both appear as log entries.

Open the **Web UI** at http://localhost:8080 for a visual trace of each execution. When it asks
for authentication, paste the value of `$OBELISK_API_TOKEN`.
Click an execution and enable **Autoload children** to see the full hierarchy
of webhook → workflow → activities, with timestamps and structured log entries.

## Crash recovery

Start the serial workflow, then kill the server while it's running:

```sh
# terminal 1
curl http://localhost:9090/serial

# terminal 2 — kill mid-execution
kill $(pgrep obelisk)
```

Restart the server — the deployment is stored in the database, so no `--deployment` flag is needed.
Obelisk resumes the workflow from its last completed step:

```sh
obelisk server run --server-config server.toml --app-config app.toml
```

## Rust (advanced)

The `rust/` directory contains the original Rust-based implementation.
It requires Rust and Cargo to build:

```sh
just build-rust
just serve-rust
```
