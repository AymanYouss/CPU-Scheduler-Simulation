// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Importing scheduling functions
const fcfsScheduling = require('./scheduling/FCFSScheduling');
const sjfScheduling = require('./scheduling/SJFScheduling');
const priorityScheduling = require('./scheduling/PriorityScheduling');
const roundRobinScheduling = require('./scheduling/RoundRobinScheduling');
const { PriorityRoundRobinScheduler } = require('./scheduling/PriorityRoundRobinScheduling');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.post('/simulate', (req, res) => {
    const { processes, algorithm, timeQuantum } = req.body;
    let result;

    switch (algorithm) {
        case 'FCFS':
            result = fcfsScheduling(processes);
            break;
        case 'SJF':
            result = sjfScheduling(processes);
            break;
        case 'Priority':
            result = priorityScheduling(processes);
            break;
        case 'Round Robin':
            result = roundRobinScheduling(processes, timeQuantum);
            break;
        case 'Priority Round Robin':
            const scheduler = new PriorityRoundRobinScheduler(processes);
            result = scheduler.scheduleProcesses(processes);
            break;
        // handle other cases
            
        default:
            res.status(400).send('Unknown algorithm');
            return;
    }

    // Ensure all algorithms return a consistent format for the client
    res.json({
        processes: result.processes || [],
        history: result.history || []
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
