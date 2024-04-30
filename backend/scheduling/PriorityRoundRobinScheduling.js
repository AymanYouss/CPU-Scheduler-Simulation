// Import the necessary Process class and the function to generate random processes
const { Process, generateRandomProcesses } = require('./Process');

// Define the PriorityRoundRobinScheduler class
class PriorityRoundRobinScheduler {
    constructor(processList, timeQuantum) {
        this.queues = {}; // Map storing queues for each priority level
        this.currentTime = 0; // Current time in the schedule
        this.totalTurnaroundTime = 0; // Total turnaround time for all processes
        this.totalWaitingTime = 0; // Total waiting time for all processes
        this.quanta = timeQuantum; // Time quantum for each process slice
        this.minPriority = Math.min(...processList.map(p => p.priority)); // Lowest priority number (higher number means lower priority)
        this.maxPriority = Math.max(...processList.map(p => p.priority)); // Highest priority number (lower number means higher priority)
        this.history = [];  // List to track history of scheduling for analysis
    }

    // Function to enqueue a process into its respective priority queue
    enqueueProcess(process) {
        if (!this.queues[process.priority]) {
            this.queues[process.priority] = []; // Initialize queue if it doesn't exist
        }
        this.queues[process.priority].push(process); // Add process to the queue
    }

    // Main scheduling function that processes all the processes in the list
    scheduleProcesses(processList) {
        // Sort processes by arrival time
        processList.sort((a, b) => a.arrivalTime - b.arrivalTime);
        let nextProcessIndex = 0; // Index to track the next process to enqueue
        let activeProcesses = []; // Array to hold processes that complete their execution
        let ganttLog = []; // Array to log Gantt chart entries

        // Continue scheduling until all processes are handled
        while (nextProcessIndex < processList.length || !this.allQueuesEmpty()) {
            // Enqueue processes that have arrived by the current time
            while (nextProcessIndex < processList.length && processList[nextProcessIndex].arrivalTime <= this.currentTime) {
                this.enqueueProcess(processList[nextProcessIndex]);
                nextProcessIndex++;
            }

            // Advance time to the next process's arrival if all queues are empty
            if (this.allQueuesEmpty()) {
                this.currentTime = processList[nextProcessIndex].arrivalTime;
                continue;
            }

            // Process each queue by priority level from highest to lowest priority
            for (let priority = this.minPriority; priority <= this.maxPriority; priority++) {
                if (this.queues[priority] && this.queues[priority].length > 0) {
                    let process = this.queues[priority].shift(); // Dequeue the first process
                    let startTime = this.currentTime; // Record start time
                    let timeSlice = Math.min(process.remainingBurstTime, this.quanta); // Determine time slice for the process
                    process.remainingBurstTime -= timeSlice; // Decrease the remaining burst time
                    this.currentTime += timeSlice; // Update current time

                    // Log Gantt chart entry
                    ganttLog.push({
                        pid: process.pid,
                        startTime: startTime,
                        endTime: this.currentTime,
                        burstTime: timeSlice
                    });

                    // Re-enqueue the process if it's not finished, otherwise finalize it
                    if (process.remainingBurstTime > 0) {
                        this.enqueueProcess(process);
                    } else {
                        process.completionTime = this.currentTime; // Set completion time
                        process.waitingTime = this.currentTime - process.arrivalTime - process.burstTime; // Calculate waiting time
                        process.turnaroundTime = this.currentTime - process.arrivalTime; // Calculate turnaround time
                        this.totalTurnaroundTime += process.turnaroundTime; // Accumulate total turnaround time
                        this.totalWaitingTime += process.waitingTime; // Accumulate total waiting time
                        activeProcesses.push(process); // Add process to active processes list

                        // Update history with averages after each process completion
                        this.history.push({
                            time: this.currentTime,
                            avgWaitingTime: this.totalWaitingTime / activeProcesses.length,
                            avgTurnaroundTime: this.totalTurnaroundTime / activeProcesses.length
                        });
                    }
                    break; // Exit the loop after handling one process per time slice
                }
            }
        }

        // Return the list of processed processes and the history and Gantt chart logs
        return { processes: activeProcesses, history: this.history, ganttLog: ganttLog }; 
    }

    // Helper function to check if all queues are empty
    allQueuesEmpty() {
        return Object.keys(this.queues).every(priority => this.queues[priority].length === 0);
    }
}

// Export the PriorityRoundRobinScheduler class for use elsewhere in the application
module.exports = { PriorityRoundRobinScheduler };
