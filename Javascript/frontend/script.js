document.addEventListener('DOMContentLoaded', function() {
    const addProcessBtn = document.getElementById('add-process');
    const runBtn = document.getElementById('run');
    const resetBtn = document.getElementById('reset');
    const algorithmSelect = document.getElementById('algorithm-select');
    const processesContainer = document.getElementById('processes-container');
    const resultsTable = document.getElementById('results-table');
    const ganttChart = document.getElementById('gantt-chart');
    const timeQuantumContainer = document.getElementById('time-quantum-container');
    const timeQuantumInput = document.getElementById('time-quantum');
    const chartContainer = document.getElementById('charts-container');
    const chartContainer2 = document.getElementById('additional-charts-container');

    function  createProcessInputRow(pid) {
        const row = document.createElement('div');
        row.className = 'process-row';
        row.innerHTML = `
            <input type="text" placeholder="Process ID" value="${pid}" readonly>
            <input type="number" placeholder="Arrival Time" min="0" step="1" required>
            <input type="number" placeholder="Burst Time" min="1" step="1" required>
        `;
        if (["Priority", "Priority Round Robin"].includes(algorithmSelect.value)) {
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
                remainingBurstTime:parseInt(row.children[2].value, 10),
                
            };
            if (row.children.length > 3) {
                process.priority = parseInt(row.children[3].value, 10);
            }
            return process;
        });
        return processes;
    }

    function displayResults(data) {

        console.log("ana dkhelt hna");
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

         // Create charts
    displayChart('waiting-time-chart2', 'waitingTime', data, 'Waiting Time');
    displayChart('turnaround-time-chart2', 'turnaroundTime', data, 'Turnaround Time');
    displayChart('completion-time-chart2', 'completionTime', data, 'Completion Time');

    // Display averages
    displayAverages(data);

        
    }
    // function plotData(history) {
    //     const waitingCtx = document.getElementById('waiting-time-chart').getContext('2d');
    //     const turnaroundCtx = document.getElementById('turnaround-time-chart').getContext('2d');
    
    //     // if (window.waitingChart) window.waitingChart.destroy();
    //     // if (window.turnaroundChart) window.turnaroundChart.destroy();
    
    //     window.waitingChart = new Chart(waitingCtx, {
    //         type: 'line',
    //         data: {
    //             labels: history.map(x => `Time ${x.time}`),
    //             datasets: [{
    //                 label: 'Average Waiting Time',
    //                 data: history.map(x => x.avgWaitingTime),
    //                 borderColor: 'red',
    //                 borderWidth: 2,
    //                 fill: false
    //             }]
    //         },
    //         options: {
    //             scales: {
    //                 y: {
    //                     beginAtZero: true
    //                 }
    //             }
    //         }
    //     });
    
    //     window.turnaroundChart = new Chart(turnaroundCtx, {
    //         type: 'line',
    //         data: {
    //             labels: history.map(x => `Time ${x.time}`),
    //             datasets: [{
    //                 label: 'Average Turnaround Time',
    //                 data: history.map(x => x.avgTurnaroundTime),
    //                 borderColor: 'blue',
    //                 borderWidth: 2,
    //                 fill: false
    //             }]
    //         },
    //         options: {
    //             scales: {
    //                 y: {
    //                     beginAtZero: true
    //                 }
    //             }
    //         }
    //     });
    // }
    function plotData(history) {
        const waitingCtx = document.getElementById('waiting-time-chart').getContext('2d');
        const turnaroundCtx = document.getElementById('turnaround-time-chart').getContext('2d');
        
        if (window.waitingChart) {
            window.waitingChart.data.labels = history.map(x => `Time ${x.time}`);
            window.waitingChart.data.datasets[0].data = history.map(x => x.avgWaitingTime);
            window.waitingChart.update();
        } else {
            window.waitingChart = new Chart(waitingCtx, createChartConfig('Average Waiting Time', history, 'avgWaitingTime', 'red'));
        }
        
        if (window.turnaroundChart) {
            window.turnaroundChart.data.labels = history.map(x => `Time ${x.time}`);
            window.turnaroundChart.data.datasets[0].data = history.map(x => x.avgTurnaroundTime);
            window.turnaroundChart.update();
        } else {
            window.turnaroundChart = new Chart(turnaroundCtx, createChartConfig('Average Turnaround Time', history, 'avgTurnaroundTime', 'blue'));
        }
    }
    
    function createChartConfig(label, history, metric, borderColor) {
        return {
            type: 'line',
            data: {
                labels: history.map(x => `Time ${x.time}`),
                datasets: [{
                    label: label,
                    data: history.map(x => x[metric]),
                    borderColor: borderColor,
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };
    }
    

    // function displayChart(canvasId, label, data, chartLabel) {
    //     const ctx = document.getElementById(canvasId).getContext('2d');
    //     new Chart(ctx, {
    //         type: 'bar',
    //         data: {
    //             labels: data.map(item => item.pid),
    //             datasets: [{
    //                 label: chartLabel,
    //                 data: data.map(item => item[label]),
    //                 backgroundColor: 'rgba(54, 162, 235, 0.2)',
    //                 borderColor: 'rgba(54, 162, 235, 1)',
    //                 borderWidth: 1
    //             }]
    //         },
    //         options: {
    //             indexAxis: 'y',
    //             scales: {
    //                 x: {
    //                     beginAtZero: true
    //                 }
    //             }
    //         }
    //     });
    // }

    window.chartInstances = window.chartInstances || {};
window.chartInstances[0] = null;

function displayChart(canvasId, label, data, chartLabel) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    // Check if there is already a chart instance and destroy it
    if (window.chartInstances[canvasId] && typeof window.chartInstances[canvasId].destroy === 'function') {
        window.chartInstances[canvasId].destroy();
    }

    // Create a new chart on the canvas
    window.chartInstances[canvasId] = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(item => item.pid),
            datasets: [{
                label: chartLabel,
                data: data.map(item => item[label]),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
}
    
    
    function displayAverages(processes) {
        console.log("skdfds");
        const waitingTimes = processes.map(proc => proc.waitingTime);
        const turnaroundTimes = processes.map(proc => proc.turnaroundTime);
        const completionTimes = processes.map(proc => proc.completionTime);
    
        const sum = (arr) => arr.reduce((a, b) => a + b, 0);
        const avgWaitingTime = sum(waitingTimes) / waitingTimes.length;
        const avgTurnaroundTime = sum(turnaroundTimes) / turnaroundTimes.length;
        const avgCompletionTime = sum(completionTimes) / completionTimes.length;

        console.log(`Updating averages to: Waiting Time: ${avgWaitingTime.toFixed(2)}, Turnaround Time: ${avgTurnaroundTime.toFixed(2)}, Completion Time: ${avgCompletionTime.toFixed(2)}`);

    
        document.getElementById('av1').textContent = `Average Waiting Time: ${avgWaitingTime.toFixed(2)}`;
        document.getElementById('av2').textContent = `Average Turnaround Time: ${avgTurnaroundTime.toFixed(2)}`;
        document.getElementById('av3').textContent = `Average Completion Time: ${avgCompletionTime.toFixed(2)}`;
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
        const timeQuantum = (selectedAlgorithm === "Round Robin") ? parseInt(timeQuantumInput.value, 10) : undefined;
        console.log(selectedAlgorithm.value);
        console.log(processData);
        console.log(timeQuantum);

        fetch('/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                processes: processData,
                algorithm: selectedAlgorithm ,
                timeQuantum: timeQuantum   
            })
        })
        .then(response => response.json())
        .then(data => {
            displayResults(data.processes);
            plotData(data.history);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function resetSimulation() {
        processesContainer.innerHTML = ''; // Clear existing processes
    createProcessInputRow('P1'); // Create the initial process row
    
    if (window.waitingChart) {
        window.waitingChart.destroy();
        window.waitingChart = null; // Clear the reference
    }
    if (window.turnaroundChart) {
        window.turnaroundChart.destroy();
        window.turnaroundChart = null; // Clear the reference
    }

    // Optionally, reset any displayed averages or other indicators
    document.getElementById('av1').textContent = '';
    document.getElementById('av2').textContent = '';
    document.getElementById('av3').textContent = '';
    }

    addProcessBtn.addEventListener('click', () => createProcessInputRow(`P${processesContainer.children.length + 1}`));
    runBtn.addEventListener('click', runSimulation);
    resetBtn.addEventListener('click', resetSimulation);

    algorithmSelect.addEventListener('change', () => {
        if (algorithmSelect.value === "Round Robin") {
            timeQuantumContainer.style.display = 'block';
        } else {
            timeQuantumContainer.style.display = 'none';
        }
        processesContainer.innerHTML = ''; // Reset the input rows
        createProcessInputRow('P1'); // Add initial process row to reflect algorithm choice
    });

    // Initialize with one process row
    createProcessInputRow('P1');

    // document.getElementById('load-file').addEventListener('click', function() {
    //     const fileInput = document.getElementById('file-input');
    //     const file = fileInput.files[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onload = function(e) {
    //             const contents = e.target.result;
    //             const processes = parseFile(contents);
    //             // Assuming you have a function to send this data to the server or directly use it
    //             console.log(processes);  // For debugging
    //             console.log("Sfrdoga");
    //             runSimulation(processes);  // Implement this function as needed
    //         };
    //         reader.readAsText(file);
    //     } else {
    //         alert('Please select a file.');
    //     }
    // });
    
    // function parseFile(contents) {
    //     const lines = contents.trim().split('\n');
    //     const header = lines.shift().split(',');  // Assuming first line is header
    //     return lines.map(line => {
    //         const data = line.split(',');
    //         let process = {};
    //         header.forEach((key, index) => {
    //             process[key.trim()] = data[index].trim();
    //         });
            
    //         return process;
    //     });
    // }
//--------------------------------------------------------------------------------------------------
  
    //     document.getElementById('load-file').addEventListener('click', function() {
    //         const fileInput = document.getElementById('file-input');
    //         const file = fileInput.files[0];
    //         console.log(file);
    //         if (file) {
    //             console.log("Logaqsdfdsfds");
    //             const reader = new FileReader();
    //             reader.onload = function(e) {
    //                 const contents = e.target.result;
    //                 const processes = parseFile(contents);
    //                 console.log(processes);
    //                 fillProcessForm(processes);
    //             };
    //             reader.readAsText(file);
    //         } else {
    //             alert('Please select a file.');
    //             console.log("Makaynsh file");
    //         }
    //     });
    
    //     document.getElementById('algorithm-select').addEventListener('change', function() {
    //         const timeQuantumContainer = document.getElementById('time-quantum-container');
    //         if (this.value === 'Round Robin') {
    //             timeQuantumContainer.style.display = 'block';
    //         } else {
    //             timeQuantumContainer.style.display = 'none';
    //         }
    //     });
    
    
    // function parseFile(contents) {
    //     const lines = contents.trim().split('\n');
    //     lines.shift(); // Skip the header line
    //     return lines.map(line => {
    //         const parts = line.split(',');
    //         return {
    //             pid: parts[0].trim(),
    //             arrivalTime: parts[1].trim(),
    //             burstTime: parts[2].trim(),
    //             priority: parts[3] ? parts[3].trim() : undefined
    //         };
    //     });
    // }
    
    // function fillProcessForm(processes) {
    //     const container = document.getElementById('processes-container');
    //     container.innerHTML = ''; // Clear existing entries
    //     processes.forEach((process, index) => {
    //         addProcessToForm(process, index + 1);
    //     });
    // }
    
    // function addProcessToForm(process, index) {
    //     const row = document.createElement('div');
    //     row.className = 'process-row';
    //     row.innerHTML = `
    //         <input type="text" placeholder="Process ID" value="${process.pid}" readonly>
    //         <input type="number" placeholder="Arrival Time" value="${process.arrivalTime}" min="0" step="1" required>
    //         <input type="number" placeholder="Burst Time" value="${process.burstTime}" min="1" step="1" required>
    //         ${process.priority ? `<input type="number" placeholder="Priority" value="${process.priority}" min="1" step="1" required>` : ''}
    //     `;
    //     processesContainer.appendChild(row);
    // }

    document.getElementById('load-file').addEventListener('click', function() {
        const fileInput = document.getElementById('file-input');
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const contents = e.target.result;
                const {algorithm, processes} = parseFile(contents);
                console.log(processes);
                setAlgorithm(algorithm); // Set the algorithm dropdown based on the file
                fillProcessForm(processes);
            };
            reader.readAsText(file);
        } else {
            alert('Please select a file.');
        }
    });
    
    function setAlgorithm(algorithm) {
        const algorithmMapping = {
            'FCFS': 'FCFS',
            'SJF': 'SJF',
            'Priority': 'Priority',
            'RR': 'Round Robin',  // Assuming 'RR' stands for 'Round Robin'
            'PR': 'Priority Round Robin'  // Example if you have a Priority Round Robin
        };
    
        const algorithmSelect = document.getElementById('algorithm-select');
        const selectedAlgorithm = algorithmMapping[algorithm];  // Map the file abbreviation to the select option value
    
        if (selectedAlgorithm) {
            algorithmSelect.value = selectedAlgorithm;
            const timeQuantumContainer = document.getElementById('time-quantum-container');
            // Display time quantum input only if Round Robin is selected
            if (selectedAlgorithm === 'Round Robin') {
                timeQuantumContainer.style.display = 'block';
            } else {
                timeQuantumContainer.style.display = 'none';
            }
        } else {
            console.error('Unsupported algorithm type specified in file.');
            alert('Unsupported algorithm type specified in file.');
        }
    }
    
    function parseFile(contents) {
        const lines = contents.trim().split('\n');
        const algorithm = lines.shift().trim(); // First line is the algorithm type
        const processes = lines.map(line => {
            const parts = line.split(',');
            return {
                pid: parts[0].trim(),
                arrivalTime: parts[1].trim(),
                burstTime: parts[2].trim(),
                priority: parts.length > 3 ? parts[3].trim() : undefined // Check for presence of priority
            };
        });
        return { algorithm, processes };
    }
    
    function fillProcessForm(processes) {
        const container = document.getElementById('processes-container');
        container.innerHTML = ''; // Clear existing entries
        processes.forEach((process, index) => {
            addProcessToForm(process, index + 1);
        });
    }
    
    function addProcessToForm(process, index) {
        const row = document.createElement('div');
        row.className = 'process-row';
        row.innerHTML = `
            <input type="text" placeholder="Process ID" value="${process.pid}" readonly>
            <input type="number" placeholder="Arrival Time" value="${process.arrivalTime}" min="0" step="1" required>
            <input type="number" placeholder="Burst Time" value="${process.burstTime}" min="1" step="1" required>
            ${process.priority ? `<input type="number" placeholder="Priority" value="${process.priority}" min="1" step="1" required>` : ''}
        `;
        processesContainer.appendChild(row);
    }
    
    
    
});
