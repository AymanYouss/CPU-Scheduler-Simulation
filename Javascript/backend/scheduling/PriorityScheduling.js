const { Process, generateRandomProcesses } = require('./Process');

function priorityScheduling(processes) {
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    let currentTime = 0;
    let completedProcesses = [];
    let readyQueue = [];
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    let history = [];  // This will store the state after each process is scheduled

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

        // Record the cumulative average at each step
        history.push({
            time: currentTime,
            avgWaitingTime: totalWaitingTime / completedProcesses.length,
            avgTurnaroundTime: totalTurnaroundTime / completedProcesses.length
        });
    }

    // Return both the processes and the history for plotting
    return { processes: completedProcesses, history };
}

// Example usage
const processes = generateRandomProcesses(5, [1, 5], [5, 15], [1, 5]);
// console.log(priorityScheduling(processes));

module.exports = priorityScheduling;
