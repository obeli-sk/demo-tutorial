use exports::tutorial::workflow::workflow::Guest;
use obelisk::{
    log::log,
    types::time::{Duration, ScheduleAt},
    workflow::workflow_support::{self, ClosingStrategy, new_join_set_generated},
};
use tutorial::{
    activity::activity_sleepy::step,
    activity_obelisk_ext::activity_sleepy::{step_await_next, step_submit},
};
use wit_bindgen::generate;

generate!({ generate_all });
struct Component;
export!(Component);

impl Guest for Component {
    fn serial(iterations: u64) -> Result<(), ()> {
        log::info("serial started");
        for i in 0..iterations {
            log::info("Persistent sleep started");
            workflow_support::sleep(ScheduleAt::In(Duration::Seconds(1)));
            log::info("Persistent sleep finished");
            let result = step(i, i * 200).unwrap();
            log::info(&format!("Step succeeded {i}=={result}"));
        }
        log::info("serial completed");
        Ok(())
    }

    fn parallel(iterations: u64) -> Result<(), ()> {
        let join_set = new_join_set_generated(ClosingStrategy::Complete);
        for i in 0..iterations {
            step_submit(&join_set, i, i * 200);
        }
        for _ in 0..iterations {
            let (_execution_id, result) = step_await_next(&join_set).unwrap();
            result.unwrap();
        }
        Ok(())
    }
}
