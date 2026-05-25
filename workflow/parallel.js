// A workflow that submits all 10 step activities in parallel using join sets,
// then awaits their results one by one (structured concurrency).
import { stepSubmit, stepAwaitNext } from "tutorial:demo-obelisk-ext/activity";

export default function parallel() {
    const handles = [];
    for (let i = 0; i < 10; i++) {
        const js = obelisk.createJoinSet();
        stepSubmit(js, i, i * 200);
        handles.push({ i, js });
    }
    console.log("parallel: submitted all child executions");
    let acc = 0;
    for (const { i, js } of handles) {
        const result = stepAwaitNext(js);
        acc = 10 * acc + result;
        console.log(`step(${i})=${result}, acc=${acc}`);
        obelisk.sleep({ milliseconds: 300 });
    }
    console.log(`parallel completed: ${acc}`);
    return acc;
}
