const { Process, generateRandomProcesses } = require('./Process');

function sjfScheduling(processes) {
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    let currentTime = 0;
    let completedProcesses = [];
    let readyQueue = [];
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    let history = []; 

    while (processes.length > 0 || readyQueue.length > 0) {
        while (processes.length > 0 && processes[0].arrivalTime <= currentTime) {
            readyQueue.push(processes.shift());
        }

        if (readyQueue.length === 0) {
            currentTime = processes[0].arrivalTime;
            continue;
        }

        readyQueue.sort((a, b) => a.burstTime - b.burstTime);
        let currentProcess = readyQueue.shift();

        currentProcess.startTime = currentTime;
        currentProcess.completionTime = currentProcess.startTime + currentProcess.burstTime;
        currentProcess.waitingTime = currentProcess.startTime - currentProcess.arrivalTime;
        currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;

        currentTime = currentProcess.completionTime;

        completedProcesses.push(currentProcess);
        totalWaitingTime += currentProcess.waitingTime;
        totalTurnaroundTime += currentProcess.turnaroundTime;

        history.push({
            time: currentTime,
            avgWaitingTime: totalWaitingTime / completedProcesses.length,
            avgTurnaroundTime: totalTurnaroundTime / completedProcesses.length
        });
    }

    return { processes: completedProcesses, history:history,ganttLog:completedProcesses };
}



module.exports = sjfScheduling;
