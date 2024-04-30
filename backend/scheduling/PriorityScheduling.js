// Import necessary classes and functions
const { Process, generateRandomProcesses } = require('./Process');

// Define the priorityScheduling function that schedules processes based on their priority
function priorityScheduling(processes) {
    // Sort processes by arrival time to handle them in the order they arrive
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    let currentTime = 0; // Current time in the schedule
    let completedProcesses = []; // Array to store processes that have completed execution
    let readyQueue = []; // Queue to hold processes ready to be executed
    let totalWaitingTime = 0; // Total waiting time of all processes
    let totalTurnaroundTime = 0; // Total turnaround time of all processes
    let history = []; // Array to record history for average waiting and turnaround times

    // Loop while there are processes waiting to be scheduled or processed
    while (processes.length > 0 || readyQueue.length > 0) {
        // Move processes from the main list to the ready queue if they have arrived by the current time
        while (processes.length > 0 && processes[0].arrivalTime <= currentTime) {
            readyQueue.push(processes.shift());
        }

        // If the ready queue is empty, jump to the arrival time of the next process
        if (readyQueue.length === 0) {
            currentTime = processes[0].arrivalTime;
            continue;
        }

        // Sort the ready queue by priority, lower number indicates higher priority
        readyQueue.sort((a, b) => a.priority - b.priority);

        // Dequeue the highest priority process
        let currentProcess = readyQueue.shift();

        // Set start and completion times for the current process
        currentProcess.startTime = currentTime;
        currentProcess.completionTime = currentProcess.startTime + currentProcess.burstTime;
        currentProcess.waitingTime = currentProcess.startTime - currentProcess.arrivalTime;
        currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;

        // Update current time to the completion time of the current process
        currentTime = currentProcess.completionTime;

        // Add the current process to the list of completed processes
        completedProcesses.push(currentProcess);
        totalWaitingTime += currentProcess.waitingTime;
        totalTurnaroundTime += currentProcess.turnaroundTime;

        // Record the average waiting and turnaround times at the current time
        history.push({
            time: currentTime,
            avgWaitingTime: totalWaitingTime / completedProcesses.length,
            avgTurnaroundTime: totalTurnaroundTime / completedProcesses.length
        });
    }

    // Return the list of completed processes along with history and Gantt chart log
    return { processes: completedProcesses, history: history, ganttLog: history };
}

// Export the priorityScheduling function for use elsewhere in the application
module.exports = priorityScheduling;
