document.addEventListener('DOMContentLoaded', function() {
  const addProcessBtn = document.getElementById('add-process');
  const runBtn = document.getElementById('run');
  const resetBtn = document.getElementById('reset');
  const algorithmSelect = document.getElementById('algorithm-select');
  const processesContainer = document.getElementById('processes-container');

  function createProcessInputRow(pid) {
      const row = document.createElement('div');
      row.className = 'process-row';
      row.innerHTML = `
          <input type="text" placeholder="Process ID" value="${pid}" readonly>
          <input type="number" placeholder="Arrival Time" min="0" step="1" required>
          <input type="number" placeholder="Burst Time" min="1" step="1" required>
      `;
      processesContainer.appendChild(row);
  }

  function collectProcessData() {
      const processRows = processesContainer.getElementsByClassName('process-row');
      const processes = Array.from(processRows).map(row => {
          return {
              pid: row.querySelector('input[type="text"]').value,
              arrivalTime: parseInt(row.querySelector('input[placeholder="Arrival Time"]').value, 10),
              burstTime: parseInt(row.querySelector('input[placeholder="Burst Time"]').value, 10)
          };
      });
      return processes;
  }

  function runSimulation() {
      const processData = collectProcessData();
      const selectedAlgorithm = algorithmSelect.value;

      fetch('/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              processes: processData,
              algorithm: selectedAlgorithm
          })
      })
      .then(response => response.json())
      .then(data => {
          // Assuming `data` is the processed result from the server
          console.log(data);
          // Here you would call a function to display the data on the chart
      })
      .catch(error => {
          console.error('Error:', error);
      });
  }

  function resetSimulation() {
      processesContainer.innerHTML = ''; // Clear existing processes
      createProcessInputRow('P1'); // Create the initial process row
      // Reset other UI elements as needed
  }

  addProcessBtn.addEventListener('click', () => createProcessInputRow(`P${processesContainer.children.length + 1}`));
  runBtn.addEventListener('click', runSimulation);
  resetBtn.addEventListener('click', resetSimulation);

  // Initialize with one process row
  createProcessInputRow('P1');
});
