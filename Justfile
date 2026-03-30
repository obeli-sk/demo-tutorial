clean:
	cargo clean

build:
	(cd activity/activity-sleepy && cargo build --release)
	(cd workflow/workflow-tutorial && cargo build --profile=workflow)
	(cd webhook/webhook-tutorial && cargo build --profile=webhook)

verify:
	obelisk server verify --server-config server.toml --deployment ${CONFIG:-obelisk.toml}

serve:
	obelisk server run --server-config server.toml --deployment ${CONFIG:-obelisk.toml}

