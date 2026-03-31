// An activity that simulates work with an async sleep delay.
// Activities are retried automatically on timeout or failure.
export default async function step(idx, sleep_millis) {
    console.log(`Step ${idx} started`);
    await new Promise(r => setTimeout(r, Number(sleep_millis)));
    console.log(`Step ${idx} completed`);
    return String(idx);
}
