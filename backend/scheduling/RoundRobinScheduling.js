const { Process } = require('./Process');

function roundRobinScheduling(processList, timeQuanta) {
    let t = 0;
    let queue = [];
    let completed = [];
    let ganttLog = [];  // Log to keep track of when each process runs
    let history = []; // History log for average waiting and turnaround times
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;

    processList.sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (processList.length > 0 || queue.length > 0) {
        if (queue.length === 0) {
            let nextProcess = processList.shift();
            t = nextProcess.arrivalTime;
            queue.push(nextProcess);
        }

        let process = queue.shift();
        let startTime = t;
        let endTime = t + Math.min(process.remainingBurstTime, timeQuanta);

        if (process.startTime === undefined) {
            process.startTime = startTime;  
        }

        // Record the process running in the Gantt log
        ganttLog.push({
            pid: process.pid,
            startTime: startTime,
            endTime: endTime,
            burstTime: endTime -startTime 
        });

        while (processList.length > 0 && processList[0].arrivalTime <= endTime) {
            queue.push(processList.shift());
        }

        process.remainingBurstTime -= endTime - t;
        t = endTime;

        if (process.remainingBurstTime > 0) {
            queue.push(process);
        } else {
            process.completionTime = t;
            process.turnaroundTime = process.completionTime - process.arrivalTime;
            process.waitingTime = process.completionTime - process.burstTime - process.arrivalTime;
            completed.push(process);

            totalWaitingTime += process.waitingTime;
            totalTurnaroundTime += process.turnaroundTime;

            history.push({
                time: t,
                avgWaitingTime: totalWaitingTime / completed.length,
                avgTurnaroundTime: totalTurnaroundTime / completed.length
            });
        }
    }
    

    return { processes: completed,history:history, ganttLog: ganttLog };
}

module.exports = roundRobinScheduling;




module.exports = roundRobinScheduling;
