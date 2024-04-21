class Process {
  constructor(pid, arrivalTime, burstTime, priority = null) {
      this.pid = pid;
      this.arrivalTime = arrivalTime;
      this.burstTime = burstTime;
      this.priority = priority;
      this.remainingBurstTime = burstTime;
      this.startTime = null;
      this.completionTime = null;
  }

  toString() {
      return `Process(pid=${this.pid}, arrivalTime=${this.arrivalTime}, burstTime=${this.burstTime}, priority=${this.priority})`;
  }
}

function generateRandomProcesses(numProcesses, arrivalTimeRange, burstTimeRange, priorityRange = null) {
  const processes = [];
  for (let pid = 1; pid <= numProcesses; pid++) {
      const arrivalTime = Math.floor(Math.random() * (arrivalTimeRange[1] - arrivalTimeRange[0] + 1)) + arrivalTimeRange[0];
      const burstTime = Math.floor(Math.random() * (burstTimeRange[1] - burstTimeRange[0] + 1)) + burstTimeRange[0];
      const priority = priorityRange ? Math.floor(Math.random() * (priorityRange[1] - priorityRange[0] + 1)) + priorityRange[0] : null;
      processes.push(new Process(pid, arrivalTime, burstTime, priority));
  }
  return processes;
}

module.exports = { Process, generateRandomProcesses };
