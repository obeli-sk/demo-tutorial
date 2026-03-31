# Demo-tutorial

This repo contains the code used in the
[Comparing Obelisk with DBOS](http://obeli.sk/blog/comparing-dbos-part-1) blog post,
updated for Obelisk 0.36 with native JavaScript support.

The tutorial shows a **serial** and a **parallel** durable workflow,
each driving a simple `step` activity.

## JavaScript (default)

No build step required. Just install [Obelisk](https://obeli.sk/install/) and run:

```sh
obelisk server run --deployment deployment.toml
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

List top-level executions (one per webhook call):

```sh
curl -s "http://localhost:5005/v1/executions"
```

```
E_01KN209P2PCVPGAPRC3DBAC92C  Finished(ok)  wasi:http/incoming-handler.handle  2026-03-31 13:11:01 UTC
E_01KN208SQDTVW4ECBT1DPHAD03  Finished(ok)  wasi:http/incoming-handler.handle  2026-03-31 13:10:32 UTC
```

Each line is: execution ID, state, FFQN (all webhooks use `wasi:http/incoming-handler.handle`), and creation time.

Fetch logs for a webhook execution (includes its `console.log` output):

```sh
EXECUTION_ID=E_01KN209P2PCVPGAPRC3DBAC92C
curl -s "http://localhost:5005/v1/executions/${EXECUTION_ID}/logs"
```

To see the child executions spawned by a webhook — the workflow and its activities — use
`show_derived=true`. Narrow to tutorial executions with `ffqn_prefix`:

```sh
curl -s "http://localhost:5005/v1/executions?show_derived=true&ffqn_prefix=tutorial:demo"
```

```
E_01KN209P2PCVPGAPRC3DBAC92C.o:1_1         Finished(ok)  tutorial:demo/workflow.serial   2026-03-31 13:11:01 UTC
E_01KN209P2PCVPGAPRC3DBAC92C.o:1_1.o:2-step_1  Finished(ok)  tutorial:demo/activity.step 2026-03-31 13:11:01 UTC
...
```

Then fetch logs for any individual execution by its ID. `console.log` calls in workflows
and activities both appear as log entries.

Open the **Web UI** at http://localhost:8080 for a visual trace of each execution.
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
obelisk server run
```

## Rust (advanced)

The `rust/` directory contains the original Rust-based implementation.
It requires Rust and Cargo to build:

```sh
just build-rust
just serve-rust
```
