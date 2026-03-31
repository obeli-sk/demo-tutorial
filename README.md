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

Open the Web UI at http://localhost:8080 to see the execution log
and trace view for each workflow.

## Rust (advanced)

The `rust/` directory contains the original Rust-based implementation.
It requires Rust and Cargo to build:

```sh
just build-rust
just serve-rust
```

See `rust/` for the full source.
