#!/usr/bin/env bash

set -exuo pipefail
cd "$(dirname "$0")/.."

cargo clippy --manifest-path rust/Cargo.toml --workspace --all-targets --fix --allow-dirty --allow-staged -- -D warnings
cargo fmt --manifest-path rust/Cargo.toml --all

git status -s
