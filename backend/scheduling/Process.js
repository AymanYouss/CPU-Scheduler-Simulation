// Define the Process class to encapsulate details about a process
class Process {
  // Constructor to initialize a new Process object
  constructor(pid, arrivalTime, burstTime, priority = null) {
      this.pid = pid; // Process ID
      this.arrivalTime = arrivalTime; // Time when the process arrives
      this.burstTime = burstTime; // CPU burst time required by the process
      this.priority = priority; // Priority of the process (optional)
      this.remainingBurstTime = burstTime; // Remaining burst time, initialized to burstTime
      this.startTime = null; // Time when the process starts execution (initially null)
      this.completionTime = null; // Time when the process completes execution (initially null)
      this.waitingTime = 0; // Waiting time accumulated by the process
      this.turnaroundTime = 0; // Turnaround time from arrival to completion
  }

  // Method to convert process details into a string format
  toString() {
    return `Process(pid=${this.pid}, arrivalTime=${this.arrivalTime}, burstTime=${this.burstTime}, priority=${this.priority}, remainingBurstTime=${this.remainingBurstTime})`;
  }
}

// Function to generate a list of random processes
function generateRandomProcesses(numProcesses, arrivalTimeRange, burstTimeRange, priorityRange = null) {
  const processes = []; // Array to hold the generated processes
  for (let pid = 1; pid <= numProcesses; pid++) {
      // Randomly generate arrival time within the specified range
      const arrivalTime = Math.floor(Math.random() * (arrivalTimeRange[1] - arrivalTimeRange[0] + 1)) + arrivalTimeRange[0];
      // Randomly generate burst time within the specified range
      const burstTime = Math.floor(Math.random() * (burstTimeRange[1] - burstTimeRange[0] + 1)) + burstTimeRange[0];
      // Randomly generate priority if a range is provided
      const priority = priorityRange ? Math.floor(Math.random() * (priorityRange[1] - priorityRange[0] + 1)) + priorityRange[0] : null;
      // Create a new Process object and add it to the processes array
      processes.push(new Process(pid, arrivalTime, burstTime, priority));
  }
  return processes; // Return the array of generated processes
}

// Export the Process class and generateRandomProcesses function for use elsewhere
module.exports = { Process, generateRandomProcesses };
