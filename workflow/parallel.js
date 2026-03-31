// A workflow that submits all 10 step activities in parallel using join sets,
// then awaits their results one by one (structured concurrency).
export default function parallel() {
    const joinSets = [];
    for (let i = 0; i < 10; i++) {
        const js = obelisk.createJoinSet();
        js.submit("tutorial:demo/activity.step", [i, i * 200]);
        joinSets.push({ i, js });
    }
    console.log("parallel: submitted all child executions");
    let acc = 0;
    for (const { i, js } of joinSets) {
        const response = js.joinNext();
        if (!response.ok) throw `step ${i} failed`;
        const result = obelisk.getResult(response.id);
        acc = 10 * acc + Number(result.ok);
        console.log(`step(${i})=${result.ok}, acc=${acc}`);
        obelisk.sleep({ milliseconds: 300 });
    }
    console.log(`parallel completed: ${acc}`);
    return String(acc);
}
