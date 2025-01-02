const express = require('express');
const sqlite3 = require('sqlite3');
const multer = require('multer');

const app = express();
const db = new sqlite3.Database('./jobs.db');

// MIDDLEWARE
const upload = multer();

// INITIALIZE DATABASE
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title varchar(255) NOT NULL,
            type varchar(255) NOT NULL,
            description TEXT NOT NULL,
            location varchar(255) NOT NULL,
            salary varchar(255) NOT NULL,
            company_name varchar(255) NOT NULL,
            company_description TEXT NOT NULL,
            company_contact_email varchar(255) NOT NULL,
            company_contact_phone varchar(255) NOT NULL
        )
        `);
});

// ROUTES (CRUD)
app.get('/api/jobs', (req, res) => {
    const queary = 'SELECT * FROM jobs';
    db.all(queary, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message, isSucess: false });
            return;
        }
        res.json(rows);
    })
});

app.get('/api/jobs/:id', (req, res) => {
    const id = req.params.id;
    const queary = 'SELECT * FROM jobs WHERE id = ?';
    db.get(queary, [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message, isSucess: false });
            return;
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Job not found', isSucess: false });
        }
    });
});

app.post('/api/jobs/add', upload.none(), (req, res) => {
    const {title, type, description, location, salary, company_name, company_description, company_contact_email, company_contact_phone } = req.body;
    const queary = 'INSERT INTO jobs (title, type, description, location, salary, company_name, company_description, company_contact_email, company_contact_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.run(queary, [title, type, description, location, salary, company_name, company_description, company_contact_email, company_contact_phone], (err) => {
        if (err) {
            res.status(500).json({ error: err.message, isSucess: false });
            return;
        }
        res.json({ message: 'Job added successfully', isSucess: true });
    });
});

app.put('/api/jobs/edit/:id', upload.none(), (req, res) => {
    const id = req.params.id;
    const {title, type, description, location, salary, company_name, company_description, company_contact_email, company_contact_phone } = req.body;
    const queary = 'UPDATE jobs SET title = ?, type = ?, description = ?, location = ?, salary = ?, company_name = ?, company_description = ?, company_contact_email = ?, company_contact_phone = ? WHERE id = ?';
    db.run(queary, [title, type, description, location, salary, company_name, company_description, company_contact_email, company_contact_phone, id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message, isSucess: false });
            return;
        }
        res.json({ message: 'Job updated successfully', isSucess: true });
    });
});

app.delete('/api/jobs/delete/:id', (req, res) => {
    const id = req.params.id;
    const queary = 'DELETE FROM jobs WHERE id = ?';
    db.run(queary, [id], (err) => {
        if (err) {
            res.status(500).json({ error: err.message, isSucess: false });
            return;
        }
        res.json({ message: 'Job deleted successfully', isSucess: true });
    });
});

app.listen(3000, () => {
    console.log(`Server running at http://localhost:3000`);
});