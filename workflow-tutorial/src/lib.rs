use exports::tutorial::workflow::workflow::Guest;
use obelisk::{
    log::log,
    types::time::{Duration, ScheduleAt},
    workflow::workflow_support::{self, ClosingStrategy, new_join_set_generated},
};
use std::collections::HashSet;
use tutorial::{
    activity::activity_sleepy::step,
    activity_obelisk_ext::activity_sleepy::{step_await_next, step_submit},
    sleepy_obelisk_ext::sleepy_workflow::{sleepy_workflow_await_next, sleepy_workflow_submit},
};
use wit_bindgen::generate;

mod util;

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
            let result = step(i, i * 200).inspect_err(|_| log::error("step timed out"))?;
            acc += result;
            log::info(&format!("step({i})={result}"));
        }
        log::info("serial completed");
        Ok(acc)
    }

    #[allow(clippy::mutable_key_type)]
    fn parallel() -> Result<u64, ()> {
        log::info("parallel started");
        let max_iterations = 10;
        let mut handles = HashSet::new();
        for i in 0..max_iterations {
            let join_set = new_join_set_generated(ClosingStrategy::Complete);
            step_submit(&join_set, i, i * 200);
            handles.insert((i, join_set));
        }
        log::info("parallel submitted all child executions");
        let mut acc = 0;
        for (i, join_set) in handles {
            let (_execution_id, result) =
                step_await_next(&join_set).expect("every join set has 1 execution");
            let result = result.inspect_err(|_| log::error("step timed out"))?;
            acc = 10 * acc + result; // order-sensitive
            log::info(&format!("step({i})={result}, acc={acc}"));
            workflow_support::sleep(ScheduleAt::In(Duration::Milliseconds(300)));
        }
        log::info(&format!("parallel completed: {acc}"));
        Ok(acc)
    }

    fn sleepy_parent(max: u64) -> Result<(), ()> {
        let join_set = &new_join_set_generated(ClosingStrategy::Complete);
        for idx in 0..max {
            log::info(&format!("Submitting child workflow {idx}"));
            sleepy_workflow_submit(join_set, idx);
        }
        log::info(&format!("Created {max} child workflows"));
        for counter in 0..max {
            let (_execution_id, _result) = sleepy_workflow_await_next(join_set).unwrap();
            log::debug(&format!("Collected {counter} child workflows"));
        }
        log::info(&format!("Done waiting for {max} child workflows"));
        Ok(())
    }
}
