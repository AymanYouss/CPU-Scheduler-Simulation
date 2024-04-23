const { Process, generateRandomProcesses } = require('./Process');

function fcfsScheduling(processes) {
    processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

    let currentTime = 0;
    let totalWaitingTime = 0;
    let totalTurnaroundTime = 0;

    // console.log("Process Execution Order:");
    processes.forEach(process => {
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

        // console.log(process.toString());
    });

    let averageWaitingTime = totalWaitingTime / processes.length;
    let averageTurnaroundTime = totalTurnaroundTime / processes.length;

    // console.log(`\nAverage Waiting Time: ${averageWaitingTime.toFixed(2)}`);
    // console.log(`Average Turnaround Time: ${averageTurnaroundTime.toFixed(2)}`);

    return processes;
}


module.exports = fcfsScheduling;

// Example usage
const processes = generateRandomProcesses(5, [1, 5], [5, 15]);
// console.log(fcfsScheduling(processes));
