# fly-agent

Demonstrates the **saga pattern** in Obelisk: a two-workflow system that creates a fly.io app,
runs a short-lived VM acting as an AI agent, and destroys the app afterwards — whether the
agent succeeded or not.

## Prerequisites

- [Obelisk](https://obeli.sk/install/) installed
- A fly.io account with a personal access token:

```sh
export FLY_API_TOKEN=your_token_here
```

## Run

```sh
obelisk server run --deployment deployment.toml
```

Trigger the saga (pick a globally unique app name):

```sh
APP=my-fly-agent-$(date +%s)
curl "http://localhost:9090/run/personal/${APP}/what-is-42"
```

## Saga Recovery Demo

While the agent is running (the VM executes `sleep 60`), stop it from the fly.io dashboard
or CLI to trigger the saga compensation:

```sh
fly machine stop --app ${APP} agent-vm
```

The inner `agent` workflow fails; the outer `run` workflow catches the error and deletes the
app automatically.

## Plug in a Real Agent

Replace the `alpine` image and `sleep 60` command in `workflow/agent.js` with your own agent
container. The `PROMPT` environment variable contains the text from the URL path segment.
