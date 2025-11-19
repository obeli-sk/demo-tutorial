use exports::tutorial::activity::activity_sleepy::Guest;
use std::time::Duration;
use wit_bindgen::generate;

generate!({ generate_all });
struct Component;
export!(Component);

impl Guest for Component {
    fn step(idx: u64, sleep_millis: u64) -> Result<u64, ()> {
        std::thread::sleep(Duration::from_millis(sleep_millis));
        let path = format!("file-{idx}.txt");
        std::fs::File::create(path)
            .inspect_err(|err| eprintln!("{err:?}"))
            .map_err(|_| ())?;
        Ok(idx)
    }
}
