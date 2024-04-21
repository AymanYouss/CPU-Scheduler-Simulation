const { Process } = require('./Process');

function priorityRoundRobinScheduling(processes, timeQuanta) {
    let current_time = 0;
    let completed_processes = [];
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime || a.priority - b.priority);

    while (processes.length > 0) {
        let process = processes.shift();

        if (process.start_time === null || process.start_time < current_time) {
            process.start_time = current_time;
        }

        let execution_time = Math.min(process.remainingBurstTime, timeQuanta);
        process.remainingBurstTime -= execution_time;
        current_time += execution_time;

        if (process.remainingBurstTime === 0) {
            process.completionTime = current_time;
            process.turnaroundTime = process.completionTime - process.arrivalTime;
            process.waitingTime = process.turnaroundTime - process.burstTime;
            completed_processes.push(process);
        } else {
            processes.push(process); // Re-queue the process at the end
        }
    }

    return completed_processes;
}

module.exports = priorityRoundRobinScheduling;