# fly-agent

Demonstrates the **saga pattern** in Obelisk: a two-workflow system that creates a fly.io app,
runs a short-lived VM acting as an AI agent, and destroys the app afterwards, whether the
agent succeeded or not. Five app-local JS activities in `activity/` call only the Fly APIs this
example needs. No external Fly component is required.

## Prerequisites

- [Obelisk](https://obeli.sk/install/) installed
- A fly.io account with a personal access token:

```sh
export FLY_API_TOKEN=your_token_here
```

## Run

```sh
obelisk server run --app-config app.toml --deployment deployment.toml
```

Trigger the saga with your actual organization slug and a globally unique app name. The `personal`
alias is unsuitable here because Fly returns the real slug on the idempotency check after a retry.

```sh
ORG_SLUG=your-org-slug
APP=my-fly-agent-$(date +%s)
curl -v "http://localhost:9090/run/${ORG_SLUG}/${APP}/what-is-42"
```

## Saga Recovery Demo

While the agent is running (the VM executes `sleep 60`), stop it from the fly.io dashboard
or CLI to trigger the saga compensation:

```sh
fly machine stop --app ${APP} agent-vm
```

The inner `agent` workflow fails; the outer `run` workflow catches the error and deletes the
app automatically.

The Fly activities use `FLY_API_TOKEN` only as an outbound HTTP placeholder. Obelisk substitutes
the secret in the `Authorization` header for the approved Fly host; the JS activity cannot read the
plaintext token.

Run the API behavior tests with `node --test activity/fly-api.test.mjs`. They mock Fly HTTP calls and
do not create any Fly resources.

## Plug in a Real Agent

Replace the `alpine` image and `sleep 60` command in `workflow/agent.js` with your own agent
container. The `PROMPT` environment variable contains the text from the URL path segment.
