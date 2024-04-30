const fs = require('fs');
const { Process } = require('./Process');
const roundRobinScheduling = require('./RoundRobinScheduling');
const priorityScheduling = require('./PriorityScheduling');
const sjfScheduling = require('./SJFScheduling');
const fcfsScheduling = require('./FCFSScheduling');
console.log("ssdfdsfds")

function loadTestCases() {
    const rawData = fs.readFileSync('testcases.json');
    return JSON.parse(rawData);
}

function checkResults(actual, expected) {
    console.log("Checking results...");
    console.log(actual);
    const actualResults = actual.processes.map(p => ({
        pid: p.pid,
        completionTime: p.completionTime,
        turnaroundTime: p.completionTime - p.arrivalTime,
        waitingTime: p.waitingTime
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

function testSchedulingAlgorithm(algorithm, algorithmFunction) {
    const testCases = loadTestCases()[algorithm];
    const processes = testCases.input.map(p => new Process(p.pid, p.arrivalTime, p.burstTime, p.priority, p.waitingTime));
    const results = algorithmFunction(processes);
    checkResults(results, testCases.expected.results);
}

function main() {
    console.log("Testing Round Robin Scheduling...");
    testSchedulingAlgorithm('roundRobin', roundRobinScheduling);

    console.log("Testing Priority Scheduling...");
    testSchedulingAlgorithm('priority', priorityScheduling);

    console.log("Testing Shortest Job First Scheduling...");
    testSchedulingAlgorithm('sjf', sjfScheduling);

    console.log("Testing First-Come, First-Serve Scheduling...");
    testSchedulingAlgorithm('fcfs', fcfsScheduling);
}

// testRoundRobin();
console.log("-----------------------------");
main();
