const { Process, generateRandomProcesses } = require('./Process');

class PriorityRoundRobinScheduler {
    constructor(processList, timeQuantum) {
        this.queues = {}; // Map of priority levels to their queues
        this.currentTime = 0; // Global clock
        this.totalTurnaroundTime = 0;
        this.totalWaitingTime = 0;
        this.quanta = timeQuantum;
        this.minPriority = Math.min(...processList.map(p => p.priority)); // Calculate minimum priority
        this.maxPriority = Math.max(...processList.map(p => p.priority)); // Calculate maximum priority
        this.history = [];  // Initialize history tracking
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
                    let startTime = this.currentTime; // Capture start time
                    let timeSlice = Math.min(process.remainingBurstTime, this.quanta);
                    process.remainingBurstTime -= timeSlice;
                    this.currentTime += timeSlice;

                    process.startTime = startTime;

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
                    break; 
                }
            }
        }

        return { processes: activeProcesses, history: this.history, ganttLog: ganttLog }; 
    }

    allQueuesEmpty() {
        return Object.keys(this.queues).every(priority => this.queues[priority].length === 0);
    }
}



module.exports = { PriorityRoundRobinScheduler };
