clean:
	cargo clean

build:
	(cd activity-sleepy && cargo build --release)

verify:
	obelisk server verify --config ${CONFIG:-obelisk.toml}

serve:
	obelisk server run --config ${CONFIG:-obelisk.toml}

