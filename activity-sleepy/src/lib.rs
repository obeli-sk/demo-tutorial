use std::time::Duration;

use exports::tutorial::activity::activity_sleepy::Guest;
use wit_bindgen::generate;

generate!({ generate_all });
struct Component;
export!(Component);

impl Guest for Component {
    fn step(idx: u64, sleep_millis: u64) -> Result<u64, ()> {
        std::thread::sleep(Duration::from_millis(sleep_millis));
        Ok(idx)
    }
}
