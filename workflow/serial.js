// A workflow that calls the step activity 10 times in sequence,
// with a 1-second persistent sleep between each call.
// Persistent sleeps survive server crashes and restarts.
import { step } from "tutorial:demo/activity";

export default function serial() {
    let acc = 0;
    for (let i = 0; i < 10; i++) {
        obelisk.sleep({ seconds: 1 });
        const result = step(i, i * 200);
        acc += result;
        console.log(`step(${i})=${result}`);
    }
    console.log(`serial completed: ${acc}`);
    return acc;
}
