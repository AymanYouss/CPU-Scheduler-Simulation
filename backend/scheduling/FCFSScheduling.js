// Import the Process class and the function to generate random processes
const { Process, generateRandomProcesses } = require('./Process');

// Define the function for First-Come, First-Served (FCFS) scheduling
function fcfsScheduling(processes) {
    // Sort processes by arrival time to handle them in the order they arrive
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
    
    let currentTime = 0; // Track the current time of the scheduler
    let totalWaitingTime = 0; // Sum of all waiting times for processes
    let totalTurnaroundTime = 0; // Sum of all turnaround times for processes
    let history = []; // Record history for average waiting and turnaround times

    // Iterate over each process to calculate scheduling metrics
    processes.forEach((process, index) => {
        // If the current time is less than the process's arrival time, fast-forward time
        if (currentTime < process.arrivalTime) {
            currentTime = process.arrivalTime;
        }

        process.startTime = currentTime; // Set start time to the current time
        process.completionTime = process.startTime + process.burstTime; // Calculate completion time
        process.waitingTime = process.startTime - process.arrivalTime; // Calculate waiting time
        process.turnaroundTime = process.completionTime - process.arrivalTime; // Calculate turnaround time

        // Move the current time forward to the completion time of the current process
        currentTime = process.completionTime;
        
        // Accumulate waiting and turnaround times
        totalWaitingTime += process.waitingTime;
        totalTurnaroundTime += process.turnaroundTime;

        // Log the average waiting and turnaround times at this point
        history.push({
            time: currentTime,
            avgWaitingTime: totalWaitingTime / (index + 1),
            avgTurnaroundTime: totalTurnaroundTime / (index + 1)
        });
    });

    // Return the processes with their metrics and the history of average times
    return {processes: processes, history: history, ganttLog: processes};
}

// Export the fcfsScheduling function for use in other parts of the application
module.exports = fcfsScheduling;
