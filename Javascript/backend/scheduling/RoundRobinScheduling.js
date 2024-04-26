const { Process } = require('./Process');

function roundRobinScheduling(processList, timeQuanta) {
    let t = 0;
    let completed = [];
    let history = [];
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;

    processList.sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (processList.length > 0) {
        let available = processList.filter(p => p.arrivalTime <= t);
        if (available.length === 0) {
            t++;
            continue;
        }

        let process = available[0];
        processList = processList.filter(p => p.pid !== process.pid);

        let executionTime = Math.min(process.remainingBurstTime, timeQuanta);
        process.remainingBurstTime -= executionTime;
        t += executionTime;

        if (process.remainingBurstTime === 0) {
            process.completionTime = t;
            process.start_time = process.completionTime - process.burstTime;
            process.turnaroundTime = process.completionTime - process.arrivalTime;
            process.waitingTime = process.start_time - process.arrivalTime;
            completed.push(process);

            totalWaitingTime += process.waitingTime;
            totalTurnaroundTime += process.turnaroundTime;

            history.push({
                time: t,
                avgWaitingTime: totalWaitingTime / completed.length,
                avgTurnaroundTime: totalTurnaroundTime / completed.length
            });
        } else {
            processList.push(process); // Re-enqueue the process if it still has remaining burst time
        }
    }

    // Return both the processes and the history for plotting
    return { processes: completed, history };
}

module.exports = roundRobinScheduling;
