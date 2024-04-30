const fs = require('fs');
const { Process } = require('../scheduling/Process');
const roundRobinScheduling = require('../scheduling/RoundRobinScheduling');
const priorityScheduling = require('../scheduling/PriorityScheduling');
const sjfScheduling = require('../scheduling/SJFScheduling');
const fcfsScheduling = require('../scheduling/FCFSScheduling');
const { PriorityRoundRobinScheduler } = require('../scheduling/PriorityRoundRobinScheduling');

function loadTestCases() {
    const rawData = fs.readFileSync('./testcases.json');
    return JSON.parse(rawData);
}

function checkResults(actual, expected) {
    console.log("Checking results...");
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


function testSchedulingAlgorithm(algorithm, algorithmFunction) {
    const testCases = loadTestCases()[algorithm];
    const processes = testCases.input.map(p => new Process(p.pid, p.arrivalTime, p.burstTime, p.priority, p.waitingTime));
    let results;
    if (algorithm === "priorityRoundRobin"){
        const scheduler = new PriorityRoundRobinScheduler(processes, testCases.timeQuanta);
        results = scheduler.scheduleProcesses(processes);
    } 
    else if (algorithm === "roundRobin"){
        results = algorithmFunction(processes,testCases.timeQuanta);
        
    } else{
        results = algorithmFunction(processes);
    }
   
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

    console.log("Testing Priority Round Robin Scheduling...");
    testSchedulingAlgorithm('priorityRoundRobin', null);
}

main();
