const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3030;

// MySQL connection
const db = mysql.createConnection({
  host: 'your_database_host',
  user: 'your_database_user',
  password: 'your_database_password',
  database: 'your_database',
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Express route to receive sensor data
app.post('/api/sensor-data', (req, res) => {
  const { temperature, humidity } = req.body;

  if (temperature && humidity) {
    const query = 'INSERT INTO sensor_data (temperature, humidity) VALUES (?, ?)';
    db.query(query, [temperature, humidity], (err, result) => {
      if (err) {
        console.error('Error inserting data into database:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.status(200).json({ message: 'Data inserted successfully' });
      }
    });
  } else {
    res.status(400).json({ error: 'Invalid data format' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});