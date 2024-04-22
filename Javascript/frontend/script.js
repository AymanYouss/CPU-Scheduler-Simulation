document.addEventListener('DOMContentLoaded', function() {
    const addProcessBtn = document.getElementById('add-process');
    const runBtn = document.getElementById('run');
    const resetBtn = document.getElementById('reset');
    const algorithmSelect = document.getElementById('algorithm-select');
    const processesContainer = document.getElementById('processes-container');
    const resultsTable = document.getElementById('results-table');
    const ganttChart = document.getElementById('gantt-chart');

    function createProcessInputRow(pid) {
        const row = document.createElement('div');
        row.className = 'process-row';
        row.innerHTML = `
            <input type="text" placeholder="Process ID" value="${pid}" readonly>
            <input type="number" placeholder="Arrival Time" min="0" step="1" required>
            <input type="number" placeholder="Burst Time" min="1" step="1" required>
        `;
        if (["Round Robin", "Priority Round Robin"].includes(algorithmSelect.value)) {
            row.innerHTML += `<input type="number" placeholder="Priority" min="1" step="1" required>`;
        }
        processesContainer.appendChild(row);
    }

    function collectProcessData() {
        const processRows = processesContainer.getElementsByClassName('process-row');
        const processes = Array.from(processRows).map(row => {
            const process = {
                pid: row.children[0].value,
                arrivalTime: parseInt(row.children[1].value, 10),
                burstTime: parseInt(row.children[2].value, 10),
            };
            if (row.children.length > 3) {
                process.priority = parseInt(row.children[3].value, 10);
            }
            return process;
        });
        return processes;
    }

    function displayResults(data) {

        
        // Clear previous results
        resultsTable.innerHTML = '';
        ganttChart.innerHTML = '';
    
        // Create and append the results table
        const table = document.createElement('table');
        table.className = 'results-table';
        table.innerHTML = `
            <tr>
                <th>Process ID</th>
                <th>Arrival Time</th>
                <th>Burst Time</th>
                <th>Priority</th>
                <th>Start Time</th>
                <th>Completion Time</th>
                <th>Turnaround Time</th>
                <th>Waiting Time</th>
            </tr>
        `;
        data.forEach(proc => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${proc.pid}</td>
                <td>${proc.arrivalTime}</td>
                <td>${proc.burstTime}</td>
                <td>${proc.priority ?? 'N/A'}</td>
                <td>${proc.startTime}</td>
                <td>${proc.completionTime}</td>
                <td>${proc.turnaroundTime}</td>
                <td>${proc.waitingTime}</td>
            `;
            table.appendChild(row);
        });
        resultsTable.appendChild(table);
    
        // Create and append the Gantt chart
    let currentTime = 0;
    data.forEach((proc, index) => {
        const bar = document.createElement('div');
        bar.className = 'gantt-bar';
        bar.style.width = `${proc.burstTime * 20}px`; // Scaling factor for visualization
        bar.style.backgroundColor = getRandomColor();
        bar.textContent = proc.pid;

        // Calculate the starting point for the bar
        const offset = proc.startTime - currentTime;
        bar.style.marginLeft = `${offset * 20}px`; // Reflecting any idle time

        // Create a progress bar inside the Gantt bar
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.style.width = '0%'; // Initialize to 0% width
        bar.appendChild(progressBar);

        // Update current time
        currentTime = proc.completionTime;

        ganttChart.appendChild(bar);

        // Animate the progress bar
        setTimeout(() => {
            progressBar.style.width = '100%'; // Fill the bar to indicate completion
        }, index * 500); // Delay each animation for sequential effect
    });

    
        // Optionally, set the total width based on time or make it scrollable
        ganttChart.style.overflowX = 'auto';
    }
    
    // Helper function to generate random colors for Gantt bars
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
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
            displayResults(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function resetSimulation() {
        processesContainer.innerHTML = ''; // Clear existing processes
        createProcessInputRow('P1'); // Create the initial process row
    }

    addProcessBtn.addEventListener('click', () => createProcessInputRow(`P${processesContainer.children.length + 1}`));
    runBtn.addEventListener('click', runSimulation);
    resetBtn.addEventListener('click', resetSimulation);

    algorithmSelect.addEventListener('change', () => {
        processesContainer.innerHTML = ''; // Reset the input rows
        createProcessInputRow('P1'); // Add initial process row to reflect algorithm choice
    });

    // Initialize with one process row
    createProcessInputRow('P1');
});
