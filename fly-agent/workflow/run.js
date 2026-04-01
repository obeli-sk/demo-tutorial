// ffqn: demo:fly-agent/workflow.run(app-name: string, org-slug: string, prompt: string) -> result<string, string>
//
// Outer (saga) workflow: executes the agent child workflow and — regardless
// of whether it succeeds or fails — always attempts to delete the fly.io app.
// This is the saga pattern: the compensation action (app deletion) runs even
// when the server crashes mid-execution, because Obelisk replays the execution
// log on restart and continues from the last completed step.
export default function run(app_name, org_slug, prompt) {
    let result = null;
    let error = null;

    // Execute the inner agent workflow, capturing any failure so cleanup
    // can still run.
    try {
        result = obelisk.call("demo:fly-agent/workflow.agent", [app_name, org_slug, prompt]);
    } catch (e) {
        error = String(e);
        console.log(`Agent workflow failed: ${error}`);
    }

    // Saga compensation: always delete the app, whether agent succeeded or not.
    // A crash between the try/catch above and the delete below is safe: on
    // restart Obelisk replays the log and retries the delete from this point.
    console.log(`Deleting app: ${app_name}`);
    try {
        obelisk.call("obelisk-flyio:activity-fly-http/apps@1.0.0-beta.delete", [app_name, true]);
        console.log("App deleted");
    } catch (e) {
        console.log(`App deletion failed (manual cleanup may be needed): ${e}`);
    }

    // Propagate error or return result.
    if (error !== null) throw error;
    return result;
}
