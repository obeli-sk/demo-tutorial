clean:
	cargo clean

generate-ext:
	(cd activity-sleepy/wit && obelisk generate extensions activity_wasm . ext)
	(cd workflow-sleepy/wit && obelisk generate extensions workflow . ext)

build:
	(cd activity-sleepy && cargo build --release)
	(cd workflow-sleepy && cargo build --profile=workflow)
	(cd workflow-tutorial && cargo build --profile=workflow)
	(cd webhook-tutorial && cargo build --profile=webhook)

verify:
	obelisk server verify --config ${CONFIG:-obelisk.toml}

serve:
	obelisk server run --config ${CONFIG:-obelisk.toml}

