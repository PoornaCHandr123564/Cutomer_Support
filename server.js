const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "customer_support"
});

db.connect((err) => {
  if (err) console.error("Database connection failed: " + err);
  else console.log("Connected to MySQL Database");
});

// Fetch logs
app.get("/logs", (req, res) => {
  db.query("SELECT * FROM logs", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Add new log
app.post("/logs", (req, res) => {
  const { query, escalation_level } = req.body;
  db.query(
    "INSERT INTO logs (query, escalation_level) VALUES (?, ?)",
    [query, escalation_level],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Log added successfully" });
    }
  );
});

// Mark issue as resolved
app.put("/logs/:id", (req, res) => {
  const logId = req.params.id;
  db.query(
    "UPDATE logs SET status = 'Resolved', response = 'Issue resolved' WHERE id = ?",
    [logId],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Log updated successfully" });
    }
  );
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
