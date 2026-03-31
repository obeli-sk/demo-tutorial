#!/usr/bin/env bash
# End-to-end test: start the server, hit both webhook endpoints, verify output.

set -exuo pipefail
cd "$(dirname "$0")/.."

obelisk server run --deployment deployment.toml &
SERVER_PID=$!
trap "kill $SERVER_PID 2>/dev/null; wait $SERVER_PID 2>/dev/null" EXIT

# Wait for server to be ready (poll the API)
for i in $(seq 1 30); do
    if curl -sf http://localhost:5005/v1/components > /dev/null 2>&1; then
        break
    fi
    sleep 1
done

# Parallel workflow: all 10 steps run concurrently — fast
RESULT=$(curl -sf http://localhost:9090/parallel)
echo "Parallel result: $RESULT"
[ "$RESULT" = "parallel workflow completed: 123456789" ]

# Serial workflow: 10 steps with 1 s persistent sleep each — ~20 s
RESULT=$(curl -sf --max-time 120 http://localhost:9090/serial)
echo "Serial result: $RESULT"
[ "$RESULT" = "serial workflow completed: 45" ]
