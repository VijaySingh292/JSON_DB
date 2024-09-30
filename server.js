// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 3000;
const JPDB_URL = 'https://api.jsonpowerdb.com'; // Replace with the JPDB URL
const JPDB_PROJECT_NAME = '<your_project_name>'; // Your JSON-Power-DB project name
const JPDB_COLLECTION_NAME = 'students'; // Your collection name

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Check if Roll No exists
app.get('/checkRollNo', async (req, res) => {
    const { rollNo } = req.query;
    try {
        const response = await axios.post(`${JPDB_URL}/jpd/`, {
            "db": JPDB_PROJECT_NAME,
            "collection": JPDB_COLLECTION_NAME,
            "filter": { rollNo: rollNo },
        });
        const student = response.data.data.length ? response.data.data[0] : null;
        res.json({ exists: !!student, student });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
});

// Add or Update Student
app.post('/submit', async (req, res) => {
    const { rollNo, fullName, class: studentClass, birthDate, address, enrollmentDate } = req.body;

    try {
        const response = await axios.post(`${JPDB_URL}/jpd/`, {
            "db": JPDB_PROJECT_NAME,
            "collection": JPDB_COLLECTION_NAME,
            "data": [{
                rollNo,
                fullName,
                class: studentClass,
                birthDate,
                address,
                enrollmentDate,
            }],
        });
        if (response.data.success) {
            res.json({ message: 'Record saved successfully.' });
        } else {
            res.json({ message: 'Record updated successfully.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error saving data' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
