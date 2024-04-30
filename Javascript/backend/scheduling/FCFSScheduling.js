const { Process, generateRandomProcesses } = require('./Process');

function fcfsScheduling(processes) {
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);
    let currentTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;
    let history = [];

    processes.forEach((process, index) => {
        if (currentTime < process.arrivalTime) {
            currentTime = process.arrivalTime;
        }

        process.startTime = currentTime;
        process.completionTime = process.startTime + process.burstTime;
        process.waitingTime = process.startTime - process.arrivalTime;
        process.turnaroundTime = process.completionTime - process.arrivalTime;

        currentTime = process.completionTime;
        totalWaitingTime += process.waitingTime;
        totalTurnaroundTime += process.turnaroundTime;

        // Record the cumulative average at each step
        history.push({
            time: currentTime,
            avgWaitingTime: totalWaitingTime / (index + 1),
            avgTurnaroundTime: totalTurnaroundTime / (index + 1)
        });
    });

    return {processes: processes, history:history ,ganttLog: processes};
}



module.exports = fcfsScheduling;

// Example usage
// const processes = generateRandomProcesses(5, [1, 5], [5, 15]);
// console.log(fcfsScheduling(processes));
