const mysql = require('mysql2/promise');
const express = require('express')
const app = express()
const port = 3000
app.use(express.json());

// Replace these with your MariaDB connection details
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'magazin',
};



// Define a route to serve the Catei.html page and Catei.css file
app.use(express.static(__dirname + '/'));

app.get('/getData', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const selectQuery = 'SELECT * FROM catei';
    const [rows, fields] = await connection.execute(selectQuery);
    connection.end();

    // Send the data as a JSON response
    res.json(rows);
  } catch (error) {
    console.error('Error selecting data:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


app.delete('/deleteData/:id', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const deleteQuery = 'DELETE FROM catei WHERE id = ?';
    const [result] = await connection.execute(deleteQuery, [req.params.id]);
    connection.end();

    if (result.affectedRows === 0) {
      // If no rows were affected, the ID was not found
      res.status(404).json({ error: 'ID not found' });
    } else {
      // Send a success response
      res.json({ success: true });
    }
  } catch (error) {
    console.error('Error deleting data:', error);
    alert(`Failed to delete entry: ${error.message}`);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.put('/updateData/:id', async (req, res) => {
  //This function is called from a html button event
  // i want to print in the console the headers of the PUT method
  console.log(req.body);


    
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});