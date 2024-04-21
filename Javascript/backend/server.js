const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const fcfsScheduling = require('./scheduling/FCFSScheduling');
const sjfScheduling = require('./scheduling/SJFScheduling');
const priorityScheduling = require('./scheduling/PriorityScheduling');

app.post('/simulate', (req, res) => {
    const { processes, algorithm } = req.body;
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
        default:
            res.status(400).send('Unknown algorithm');
            return;
    }

    res.json(result);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
