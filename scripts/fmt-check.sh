#!/usr/bin/env bash

set -exuo pipefail
cd "$(dirname "$0")/.."

cargo fmt --manifest-path rust/Cargo.toml --check
