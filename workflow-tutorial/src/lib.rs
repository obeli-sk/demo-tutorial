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
    fn serial() -> Result<u64, ()> {
        log::info("serial started");
        let mut acc = 0;
        for i in 0..10 {
            log::info("Persistent sleep started");
            workflow_support::sleep(ScheduleAt::In(Duration::Seconds(1)));
            log::info("Persistent sleep finished");
            let result = step(i, i * 200).unwrap();
            acc += result;
            log::info(&format!("Step succeeded {i}=={result}"));
        }
        log::info("serial completed");
        Ok(acc)
    }

    fn parallel() -> Result<u64, ()> {
        log::info("parallel started");
        let join_set = new_join_set_generated(ClosingStrategy::Complete);
        let max_iterations = 10;
        for i in 0..max_iterations {
            step_submit(&join_set, i, i * 200);
        }
        log::info("parallel submitted all child executions");
        let mut acc = 0;
        for _ in 0..max_iterations {
            let (_execution_id, result) = step_await_next(&join_set).unwrap();
            let result = result.unwrap();
            acc += result;
            log::info(&format!("child succeeded {result}"));
        }
        log::info("parallel completed");
        Ok(acc)
    }
}
