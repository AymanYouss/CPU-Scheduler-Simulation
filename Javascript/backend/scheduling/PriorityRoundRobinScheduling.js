const { Process } = require('./Process');

function priorityRoundRobinScheduling(processes, timeQuanta) {
    let current_time = 0;
    let completed_processes = [];
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime || a.priority - b.priority);

    while (processes.length > 0) {
        let process = processes.shift();

        if (process.start_time === undefined || process.start_time < current_time) {
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
            // Maintain priority order when re-queueing
            let index = processes.findIndex(p => p.arrivalTime > current_time || (p.arrivalTime === current_time && p.priority > process.priority));
            if (index === -1) {
                processes.push(process);
            } else {
                processes.splice(index, 0, process);
            }
        }
    }

    // Calculate average waiting and turnaround times
    let totalWaitingTime = completed_processes.reduce((acc, curr) => acc + curr.waitingTime, 0);
    let totalTurnaroundTime = completed_processes.reduce((acc, curr) => acc + curr.turnaroundTime, 0);
    let averageWaitingTime = totalWaitingTime / completed_processes.length;
    let averageTurnaroundTime = totalTurnaroundTime / completed_processes.length;

    console.log("Process Execution Order:");
    completed_processes.forEach(process => console.log(`${process.pid}: Waiting Time = ${process.waitingTime}, Turnaround Time = ${process.turnaroundTime}`));
    console.log(`\nAverage Waiting Time: ${averageWaitingTime.toFixed(2)}`);
    console.log(`Average Turnaround Time: ${averageTurnaroundTime.toFixed(2)}`);

    return { completed_processes, averageWaitingTime, averageTurnaroundTime };
}

module.exports = priorityRoundRobinScheduling;