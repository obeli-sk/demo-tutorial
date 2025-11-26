use obelisk::{
    log::log,
    types::time::{Duration, ScheduleAt},
    workflow::workflow_support,
};
use wit_bindgen::generate;

generate!({ generate_all });
struct Component;
export!(Component);

impl exports::tutorial::sleepy::sleepy_workflow::Guest for Component {
    fn sleepy_workflow(idx: u64) -> Result<(), ()> {
        log::info(&idx.to_string());
        workflow_support::sleep(ScheduleAt::In(Duration::Days(1)));
        // do some logic here
        Ok(())
    }
}
