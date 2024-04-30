const { Process, generateRandomProcesses } = require('./Process');

class PriorityRoundRobinScheduler {
    constructor(processList) {
        this.queues = {}; // Map of priority levels to their queues
        this.currentTime = 0; // Global clock
        this.totalTurnaroundTime = 0;
        this.totalWaitingTime = 0;
        this.quanta = this.calculateQuanta(processList);
        this.minPriority = Math.min(...processList.map(p => p.priority)); // Calculate minimum priority
        this.maxPriority = Math.max(...processList.map(p => p.priority)); // Calculate maximum priority
        this.history = [];  // Initialize history tracking
    }

    calculateQuanta(processList) {
        const prioritySet = new Set(processList.map(p => p.priority));
        const maxPriority = Math.max(...prioritySet);
        const minPriority = Math.min(...prioritySet);

        const quanta = {};
        prioritySet.forEach(priority => {
            // Invert the priority for the quantum: Higher priority gets the quantum of the lower and vice versa
            quanta[priority] = maxPriority - priority + minPriority;
        });

        return quanta;
    }

    enqueueProcess(process) {
        if (!this.queues[process.priority]) {
            this.queues[process.priority] = [];
        }
        this.queues[process.priority].push(process);
    }

    scheduleProcesses(processList) {
        processList.sort((a, b) => a.arrivalTime - b.arrivalTime);
        let nextProcessIndex = 0;
        let activeProcesses = [];
        let ganttLog = []; // Initialize the Gantt log

        while (nextProcessIndex < processList.length || !this.allQueuesEmpty()) {
            while (nextProcessIndex < processList.length && processList[nextProcessIndex].arrivalTime <= this.currentTime) {
                this.enqueueProcess(processList[nextProcessIndex]);
                nextProcessIndex++;
            }

            if (this.allQueuesEmpty()) {
                this.currentTime = processList[nextProcessIndex].arrivalTime;
                continue;
            }

            for (let priority = this.minPriority; priority <= this.maxPriority; priority++) {
                if (this.queues[priority] && this.queues[priority].length > 0) {
                    let process = this.queues[priority].shift();
                    let quantum = this.quanta[priority];
                    let startTime = this.currentTime; // Capture start time
                    let timeSlice = Math.min(process.remainingBurstTime, quantum);
                    process.remainingBurstTime -= timeSlice;
                    this.currentTime += timeSlice;

                    ganttLog.push({
                        pid: process.pid,
                        startTime: startTime,
                        endTime: this.currentTime,
                        burstTime: timeSlice
                    });

                    if (process.remainingBurstTime > 0) {
                        this.enqueueProcess(process);
                    } else {
                        process.completionTime = this.currentTime;
                        process.waitingTime = this.currentTime - process.arrivalTime - process.burstTime;
                        process.turnaroundTime = this.currentTime - process.arrivalTime;
                        this.totalTurnaroundTime += process.turnaroundTime;
                        this.totalWaitingTime += process.waitingTime;
                        activeProcesses.push(process);

                        // Update history for each process completion
                        this.history.push({
                            time: this.currentTime,
                            avgWaitingTime: this.totalWaitingTime / activeProcesses.length,
                            avgTurnaroundTime: this.totalTurnaroundTime / activeProcesses.length
                        });
                    }
                    break; // Process one queue at a time
                }
            }
        }

        return { processes: activeProcesses, history: this.history,ganttLog: ganttLog }; // Return both processed data and history
    }

    allQueuesEmpty() {
        return Object.keys(this.queues).every(priority => this.queues[priority].length === 0);
    }
}

// // Test the scheduler
// function testPriorityRoundRobin() {
//     const processes = generateRandomProcesses(3, [0, 10], [10, 20], [1, 5]);
//     const scheduler = new PriorityRoundRobinScheduler(processes);
//     const completedProcesses = scheduler.scheduleProcesses(processes);
//     for (const process of processes) {
//         console.log(`Process ${process.pid} (priority ${process.priority}), arrival time: ${process.arrivalTime}, and burstTime: ${process.burstTime}.`)
//     }
//     console.log();
//     completedProcesses.forEach(proc => {
//         console.log(`Process ${proc.pid} (Priority ${proc.priority}) completed at ${proc.completionTime}, Waiting Time: ${proc.waitingTime}, Turnaround Time: ${proc.turnaroundTime}`);
//     });
//     console.log(`Average turnaround time: ${scheduler.totalTurnaroundTime / processes.length}, Average Waiting Time: ${scheduler.totalWaitingTime / processes.length}`);
// }

// testPriorityRoundRobin();

// Temporary testing in the terminal


module.exports = { PriorityRoundRobinScheduler };
