// Import the necessary modules
const { Process, generateRandomProcesses } = require('./Process');

// Define the sjfScheduling function that schedules processes based on the Shortest Job First algorithm
function sjfScheduling(processes) {
    // Sort processes by arrival time to handle them in the order they arrive
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    let currentTime = 0;  // Current time in the scheduling process
    let completedProcesses = [];  // List of processes that have completed execution
    let readyQueue = [];  // Queue of processes ready to be executed
    let totalWaitingTime = 0;  // Total waiting time of all processes
    let totalTurnaroundTime = 0;  // Total turnaround time of all processes
    let history = [];  // List to record history for average waiting and turnaround times

    // Continue scheduling while there are processes waiting to be scheduled or processed
    while (processes.length > 0 || readyQueue.length > 0) {
        // Move processes from the main list to the ready queue as they arrive
        while (processes.length > 0 && processes[0].arrivalTime <= currentTime) {
            readyQueue.push(processes.shift());
        }

        // If the ready queue is empty, advance time to the next process's arrival time
        if (readyQueue.length === 0) {
            currentTime = processes[0].arrivalTime;
            continue;
        }

        // Sort the ready queue by burst time to find the shortest job
        readyQueue.sort((a, b) => a.burstTime - b.burstTime);
        let currentProcess = readyQueue.shift();  // Dequeue the shortest job

        // Set start and completion times for the current process
        currentProcess.startTime = currentTime;
        currentProcess.completionTime = currentProcess.startTime + currentProcess.burstTime;
        currentProcess.waitingTime = currentProcess.startTime - currentProcess.arrivalTime;
        currentProcess.turnaroundTime = currentProcess.completionTime - currentProcess.arrivalTime;

        // Update current time to the completion time of the current process
        currentTime = currentProcess.completionTime;

        // Add the current process to the list of completed processes
        completedProcesses.push(currentProcess);
        totalWaitingTime += currentProcess.waitingTime;  // Accumulate total waiting time
        totalTurnaroundTime += currentProcess.turnaroundTime;  // Accumulate total turnaround time

        // Record the average waiting and turnaround times at the current time
        history.push({
            time: currentTime,
            avgWaitingTime: totalWaitingTime / completedProcesses.length,
            avgTurnaroundTime: totalTurnaroundTime / completedProcesses.length
        });
    }

    // Return the list of completed processes, history, and Gantt chart log
    return { processes: completedProcesses, history: history, ganttLog: completedProcesses };
}

// Export the sjfScheduling function for use elsewhere
module.exports = sjfScheduling;
