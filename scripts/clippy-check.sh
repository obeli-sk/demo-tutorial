#!/usr/bin/env bash

set -exuo pipefail
cd "$(dirname "$0")/.."

cargo clippy --manifest-path rust/Cargo.toml --workspace --all-targets -- -D warnings
