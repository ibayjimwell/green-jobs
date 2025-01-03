const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const app = express();
const upload = multer();

// MySQL Database Connection
const db = mysql.createPool({
    host: 'localhost', // e.g., 'localhost'
    user: 'root', // e.g., 'root'
    database: 'db_green_jobs' // e.g., 'jobs_db'
});

// Middleware
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(cors()); // Enable CORS


// Routes (CRUD)

// Get all jobs
app.get('/api/jobs', (req, res) => {
    const query = 'SELECT * FROM jobs';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message, isSuccess: false });
            return;
        }
        res.json(results);
    });
});

// Get job by ID
app.get('/api/jobs/:id', (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM jobs WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message, isSuccess: false });
            return;
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ error: 'Job not found', isSuccess: false });
        }
    });
});

// Add a new job
app.post('/api/jobs/add', upload.none(), (req, res) => {
    const { title, type, description, location, salary, company_name, company_description, company_contact_email, company_contact_phone } = req.body;
    const query = `
        INSERT INTO jobs (title, type, description, location, salary, company_name, company_description, company_contact_email, company_contact_phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [title, type, description, location, salary, company_name, company_description, company_contact_email, company_contact_phone], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message, isSuccess: false });
            return;
        }
        res.json({ id: results.insertId, isSuccess: true });
    });
});

// Edit a job
app.put('/api/jobs/edit/:id', upload.none(), (req, res) => {
    const id = req.params.id;
    const { title, type, description, location, salary, company_name, company_description, company_contact_email, company_contact_phone } = req.body;
    const query = `
        UPDATE jobs
        SET title = ?, type = ?, description = ?, location = ?, salary = ?, company_name = ?, company_description = ?, company_contact_email = ?, company_contact_phone = ?
        WHERE id = ?
    `;
    db.query(query, [title, type, description, location, salary, company_name, company_description, company_contact_email, company_contact_phone, id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message, isSuccess: false });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Job not found', isSuccess: false });
        } else {
            res.json({ id: id, isSuccess: true });
        }
    });
});

// Delete a job
app.delete('/api/jobs/delete/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM jobs WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message, isSuccess: false });
            return;
        }
        if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Job not found', isSuccess: false });
        } else {
            res.json({ message: 'Job deleted successfully', isSuccess: true });
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});