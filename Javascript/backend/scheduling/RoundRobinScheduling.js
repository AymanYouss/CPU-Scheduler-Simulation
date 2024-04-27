const { Process } = require('./Process');

// function roundRobinScheduling(processList, timeQuanta) {
//     let t = 0;
//     let completed = [];
//     let history = [];
//     let totalWaitingTime = 0;
//     let totalTurnaroundTime = 0;

//     processList.sort((a, b) => a.arrivalTime - b.arrivalTime);

//     while (processList.length > 0) {
//         let available = processList.filter(p => p.arrivalTime <= t);
//         if (available.length === 0) {
//             t++;
//             continue;
//         }

//         let process = available[0];
//         processList = processList.filter(p => p.pid !== process.pid);

//         let executionTime = Math.min(process.remainingBurstTime, timeQuanta);
//         process.remainingBurstTime -= executionTime;
//         t += executionTime;

//         if (process.remainingBurstTime === 0) {
//             process.completionTime = t;
//             process.start_time = process.completionTime - process.burstTime;
//             process.turnaroundTime = process.completionTime - process.arrivalTime;
//             process.waitingTime = process.start_time - process.arrivalTime;
//             completed.push(process);

//             totalWaitingTime += process.waitingTime;
//             totalTurnaroundTime += process.turnaroundTime;

//             history.push({
//                 time: t,
//                 avgWaitingTime: totalWaitingTime / completed.length,
//                 avgTurnaroundTime: totalTurnaroundTime / completed.length
//             });
//         } else {
//             processList.push(process); // Re-enqueue the process if it still has remaining burst time
//         }
//     }

//     // Return both the processes and the history for plotting
//     return { processes: completed, history };
// }
function roundRobinScheduling(processList, timeQuanta) {
    let t = 0; // Current time
    let queue = []; // Queue of processes ready to be executed
    let completed = []; // List of completed processes
    let history = []; // History log for average waiting and turnaround times
    let totalWaitingTime = 0; // Total waiting time accumulator
    let totalTurnaroundTime = 0; // Total turnaround time accumulator

    processList.sort((a, b) => a.arrivalTime - b.arrivalTime);

    while (processList.length > 0 || queue.length > 0) {
        if (queue.length === 0) {
            // If queue is empty, find the next process by time and set current time to its arrival
            let nextProcess = processList.shift();
            t = nextProcess.arrivalTime;
            queue.push(nextProcess);
        }

        let process = queue.shift();
        
        // Determine end time of the current time slice
        let endTime = t + Math.min(process.remainingBurstTime, timeQuanta);
        
        // Check for new arrivals before this time slice ends and add them to the queue
        while (processList.length > 0 && processList[0].arrivalTime <= endTime) {
            queue.push(processList.shift());
        }

        process.remainingBurstTime -= endTime - t;
        t = endTime; // Advance time to the end of this time slice

        if (process.remainingBurstTime > 0) {
            // If process is not completed, re-enqueue it at the back of the queue
            queue.push(process);
        } else {
            // If process completes within this time slice
            process.completionTime = t;
            process.turnaroundTime = process.completionTime - process.arrivalTime;
            process.waitingTime = process.completionTime - process.burstTime - process.arrivalTime;
            completed.push(process);

            totalWaitingTime += process.waitingTime;
            totalTurnaroundTime += process.turnaroundTime;

            // Record the history of average waiting and turnaround times at each completion
            history.push({
                time: t,
                avgWaitingTime: totalWaitingTime / completed.length,
                avgTurnaroundTime: totalTurnaroundTime / completed.length
            });
        }
    }

    // Return both the completed processes and the history for plotting
    return { processes: completed, history };
}



module.exports = roundRobinScheduling;
