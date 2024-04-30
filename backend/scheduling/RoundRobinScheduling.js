// Import the Process class from the Process module
const { Process } = require('./Process');

// Define the function for Round Robin scheduling
function roundRobinScheduling(processList, timeQuanta) {
    let t = 0;  // Current time in the scheduling process
    let queue = [];  // Queue of processes ready to be executed
    let completed = [];  // List of processes that have completed execution
    let ganttLog = [];  // Log to keep track of when each process runs
    let history = []; // History log for average waiting and turnaround times
    let totalWaitingTime = 0;  // Total accumulated waiting time
    let totalTurnaroundTime = 0;  // Total accumulated turnaround time

    // Sort the process list by arrival time to handle them as they arrive
    processList.sort((a, b) => a.arrivalTime - b.arrivalTime);

    // Loop while there are processes waiting to be scheduled or processed
    while (processList.length > 0 || queue.length > 0) {
        if (queue.length === 0) {
            let nextProcess = processList.shift();
            t = nextProcess.arrivalTime;  // Advance time to the next process's arrival
            queue.push(nextProcess);
        }

        let process = queue.shift();  // Take the first process from the queue
        let startTime = t;  // Time when the process starts execution
        let endTime = t + Math.min(process.remainingBurstTime, timeQuanta);  // Calculate end time based on time quantum and remaining burst time

        // Set the start time of the process if it hasn't started yet
        if (process.startTime === undefined) {
            process.startTime = startTime;  
        }

        // Record the process's execution in the Gantt log
        ganttLog.push({
            pid: process.pid,
            startTime: startTime,
            endTime: endTime,
            burstTime: endTime - startTime 
        });

        // Check if new processes have arrived by the end time and add them to the queue
        while (processList.length > 0 && processList[0].arrivalTime <= endTime) {
            queue.push(processList.shift());
        }

        process.remainingBurstTime -= endTime - t;  // Decrease the remaining burst time by the time spent
        t = endTime;  // Update the current time to the end time of the process

        // Check if the process has completed its burst time
        if (process.remainingBurstTime > 0) {
            queue.push(process);  // Re-add to queue if not completed
        } else {
            process.completionTime = t;  // Mark completion time
            process.turnaroundTime = process.completionTime - process.arrivalTime;  // Calculate turnaround time
            process.waitingTime = process.turnaroundTime - process.burstTime;  // Calculate waiting time
            completed.push(process);  // Add to completed list

            totalWaitingTime += process.waitingTime;  // Accumulate total waiting time
            totalTurnaroundTime += process.turnaroundTime;  // Accumulate total turnaround time

            // Update history with averages after each process completion
            history.push({
                time: t,
                avgWaitingTime: totalWaitingTime / completed.length,
                avgTurnaroundTime: totalTurnaroundTime / completed.length
            });
        }
    }
    
    // Return the list of completed processes, history, and Gantt chart log
    return { processes: completed, history: history, ganttLog: ganttLog };
}

// Export the roundRobinScheduling function for use elsewhere
module.exports = roundRobinScheduling;
