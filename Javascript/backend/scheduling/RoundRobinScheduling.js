const { Process } = require('./Process');

function roundRobinScheduling(processList, timeQuanta = 2) {
    console.log(processList);
    let t = 0;
    let gantt = [];
    let completed = [];

    processList.sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (processList.length > 0) {
        let available = processList.filter(p => p.arrivalTime <= t);
        console.log(t);

        if (available.length === 0) {
            gantt.push("Idle");
            t++;
            continue;
        }

        let process = available[0];
        gantt.push(process.pid);
        processList = processList.filter(p => p.pid !== process.pid);

        let executionTime = Math.min(process.remainingBurstTime, timeQuanta);
        process.remainingBurstTime -= executionTime;
        t += executionTime;

        if (process.remainingBurstTime === 0) {
            process.completionTime = t;
            process.start_time = process.completionTime - process.burstTime;
            process.turnaroundTime = process.completionTime - process.arrivalTime;
            process.waitingTime = process.start_time - process.arrivalTime;
            completed.push(process);
        } else {
            processList.push(process);
        }
    }

    // Calculate average waiting and turnaround times
    let totalWaitingTime = completed.reduce((acc, curr) => acc + curr.waitingTime, 0);
    let totalTurnaroundTime = completed.reduce((acc, curr) => acc + curr.turnaroundTime, 0);
    let averageWaitingTime = totalWaitingTime / completed.length;
    let averageTurnaroundTime = totalTurnaroundTime / completed.length;

    console.log("Process Execution Order:");
    completed.forEach(process => console.log(process.toString()));
    console.log(`\nAverage Waiting Time: ${averageWaitingTime.toFixed(2)}`);
    console.log(`Average Turnaround Time: ${averageTurnaroundTime.toFixed(2)}`);

    return completed;
}

module.exports = roundRobinScheduling;
