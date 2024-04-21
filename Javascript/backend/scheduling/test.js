const readline = require('readline');
const { Process, generateRandomProcesses } = require('./Process');

console.log("Importing scheduling algorithms");
const fcfsScheduling = require('./FCFSScheduling');
const sjfScheduling = require('./SJFScheduling');
const priorityScheduling = require('./PriorityScheduling');
const roundRobinScheduling = require('./RoundRobinScheduling');
const priorityRoundRobinScheduling = require('./PriorityRoundRobinScheduling');

console.log("FCFS Imported:", fcfsScheduling);
console.log("SJF Imported:", sjfScheduling);
console.log("Priority Scheduling Imported:", priorityScheduling);
console.log("Round Robin Imported:", roundRobinScheduling);
console.log("Priority Round Robin Imported:", priorityRoundRobinScheduling);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => {
        rl.question(query, (answer) => {
            resolve(answer);
        });
    });
}

async function main() {
    console.log("Welcome to the CPU Scheduler Simulation!");
    console.log("Available Scheduling Algorithms:");
    console.log("1. First-Come, First-Served (FCFS)");
    console.log("2. Shortest Job First (SJF)");
    console.log("3. Priority Scheduling");
    console.log("4. Round Robin (RR)");
    console.log("5. Priority Round Robin (PRR)");

    const algoChoice = await askQuestion("Select an algorithm (1-5): ");
    const numProcesses = await askQuestion("Enter the number of processes: ");
    const arrivalTimeRange = [0, 10];
    const burstTimeRange = [1, 10];
    const priorityRange = [1, 5];
    let timeQuanta;

    if (parseInt(algoChoice, 10) === 4 || parseInt(algoChoice, 10) === 5) {
        timeQuanta = await askQuestion("Enter the time quantum: ");
    }

    const processes = generateRandomProcesses(parseInt(numProcesses, 10), arrivalTimeRange, burstTimeRange, priorityRange);

    switch (parseInt(algoChoice, 10)) {
        case 1:
            console.log("FCFS Results:");
            console.log(fcfsScheduling(processes));
            break;
        case 2:
            console.log("SJF Results:");
            console.log(sjfScheduling(processes));
            break;
        case 3:
            console.log("Priority Scheduling Results:");
            console.log(priorityScheduling(processes));
            break;
        case 4:
            console.log("Round Robin Results:");
            console.log(roundRobinScheduling(processes, parseInt(timeQuanta, 10)));
            break;
        case 5:
            console.log("Priority Round Robin Results:");
            console.log(priorityRoundRobinScheduling(processes, parseInt(timeQuanta, 10)));
            break;
        default:
            console.log("Invalid choice. Exiting.");
            process.exit(1);
    }

    rl.close();
}

main();