const { Process, generateRandomProcesses } = require('./Process');

function priorityScheduling(processes) {


    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    let currentTime = 0;
    let completedProcesses = [];
    let readyQueue = [];
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;

    while (processes.length > 0 || readyQueue.length > 0) {
        while (processes.length > 0 && processes[0].arrivalTime <= currentTime) {
            readyQueue.push(processes.shift());
        }

        if (readyQueue.length === 0) {
            currentTime = processes[0].arrivalTime;
            continue;
        }

        readyQueue.sort((a, b) => a.priority - b.priority);
        let currentProcess = readyQueue.shift();

        currentProcess.startTime = currentTime;
        currentProcess.completionTime = currentProcess.startTime + currentProcess.burstTime;
        currentProcess.waitingTime = currentProcess.startTime - currentProcess.arrivalTime;
        currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;

        currentTime = currentProcess.completionTime;

        completedProcesses.push(currentProcess);

        totalWaitingTime += currentProcess.waitingTime;
        totalTurnaroundTime += currentProcess.turnaroundTime;
    }

    let averageWaitingTime = totalWaitingTime / completedProcesses.length;
    let averageTurnaroundTime = totalTurnaroundTime / completedProcesses.length;

    console.log("Process Execution Order:");
    completedProcesses.forEach(process => console.log(process.toString()));
    console.log(`\nAverage Waiting Time: ${averageWaitingTime.toFixed(2)}`);
    console.log(`Average Turnaround Time: ${averageTurnaroundTime.toFixed(2)}`);

    return completedProcesses;
}

module.exports = priorityScheduling;


// Example usage
const processes = generateRandomProcesses(5, [1, 5], [5, 15], [1, 5]);
console.log(priorityScheduling(processes));
