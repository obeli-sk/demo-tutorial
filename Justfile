clean:
	cargo clean

generate-ext:
	(cd activity-sleepy/wit && obelisk generate extensions activity_wasm . ext)

build:
	(cd activity-sleepy && cargo build --release)
	(cd workflow-tutorial && cargo build --profile=workflow)

verify:
	obelisk server verify --config ${CONFIG:-obelisk.toml}

serve:
	obelisk server run --config ${CONFIG:-obelisk.toml}

