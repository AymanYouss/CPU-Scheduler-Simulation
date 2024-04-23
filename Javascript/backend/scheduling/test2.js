const fs = require('fs');
const { Process } = require('./Process');
const roundRobinScheduling = require('./RoundRobinScheduling');

function loadTestCases() {
    const rawData = fs.readFileSync('testcases.json');
    return JSON.parse(rawData);
}

function checkResults(actual, expected) {
    console.log("Checking results...");
    const actualResults = actual.completed.map(p => ({
        pid: p.pid,
        completionTime: p.completionTime,
        turnaroundTime: p.completionTime - p.arrivalTime,
        waitingTime: p.start_time - p.arrivalTime
    }));

    const errors = [];
    expected.forEach((exp, index) => {
        const act = actualResults.find(a => a.pid === exp.pid);
        if (!act || act.completionTime !== exp.completionTime || act.turnaroundTime !== exp.turnaroundTime || act.waitingTime !== exp.waitingTime) {
            errors.push(`Mismatch for process ${exp.pid}: Expected ${JSON.stringify(exp)}, got ${JSON.stringify(act)}`);
        }
    });

    if (errors.length === 0) {
        console.log("All results match expected outcomes!");
    } else {
        console.error("There were mismatches:");
        errors.forEach(err => console.error(err));
    }
}

function testRoundRobin() {
    const testCases = loadTestCases().roundRobin;
    const processes = testCases.input.map(p => new Process(p.pid, p.arrivalTime, p.burstTime));
    const timeQuanta = testCases.timeQuanta;

    console.log("Testing Round Robin Scheduling...");
    const actual = roundRobinScheduling(processes, timeQuanta);

    checkResults(actual, testCases.expected.results);
}

testRoundRobin();
