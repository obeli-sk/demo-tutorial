serve:
	obelisk server run --deployment deployment.toml

verify:
	obelisk server verify --deployment deployment.toml

e2e:
	./scripts/e2e.sh

# Rust-based example (requires Rust toolchain)
build-rust:
	(cd rust/activity-sleepy && env -u CARGO_TARGET_DIR cargo build --release)
	(cd rust/workflow-tutorial && env -u CARGO_TARGET_DIR cargo build --profile=workflow)
	(cd rust/webhook-tutorial && env -u CARGO_TARGET_DIR cargo build --profile=webhook)

serve-rust:
	obelisk server run --server-config rust/server.toml --deployment rust/deployment.toml

verify-rust:
	obelisk server verify --server-config rust/server.toml --deployment rust/deployment.toml
