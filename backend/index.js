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
    host: process.env.DB_HOST, // e.g., 'localhost'
    user: process.env.DB_USER, // e.g., 'root'
    database: process.env.DB_NAME, // e.g., 'jobs_db',
    password: process.env.DB_PASSWORD, // e.g., 'jobs_db'
    port: process.env.DB_PORT
});

// Middleware
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(cors()); // Enable CORS

// Create jobs table if it doesn't exist
const createJobsTableQuery = `
    CREATE TABLE IF NOT EXISTS jobs (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        location VARCHAR(255) NOT NULL,
        salary VARCHAR(255) NOT NULL,
        company_name VARCHAR(255) NOT NULL,
        company_description TEXT NOT NULL,
        company_contact_email VARCHAR(255) NOT NULL,
        company_contact_phone VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
`;
db.query(createJobsTableQuery, (err, results) => {
    if (err) {
        console.error('Error creating jobs table:', err);
    }
});

// Routes (CRUD)

// Get all jobs
app.get('/api/jobs', (req, res) => {
    const query = 'SELECT * FROM jobs';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching all jobs:', err);
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
            console.error('Error fetching job by ID:', err);
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
            console.error('Error adding new job:', err);
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
            console.error('Error editing job:', err);
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
            console.error('Error deleting job:', err);
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

module.exports = app;
