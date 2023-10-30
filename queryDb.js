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
  try {
    const connection = await mysql.createConnection(dbConfig);
    let updateQuery;
    let result;
    //check if req.body.locatie_poza is null
    if(req.body.locatie_poza == ''){
      updateQuery = 'UPDATE catei SET nume_caine = ?, data_nasterii = ?, castrat = ?, talie = ?, x_pisici = ?, x_caini = ?, data_plecare = ?, gen = ? WHERE id = ?';
      [result] = await connection.execute(updateQuery, [req.body.nume_caine, req.body.data_nasterii, req.body.castrat, req.body.talie, req.body.x_pisici, req.body.x_caini, req.body.data_plecare, req.body.gen, req.params.id]);
    }
    else
    {
      updateQuery = 'UPDATE catei SET nume_caine = ?, data_nasterii = ?, castrat = ?, talie = ?, x_pisici = ?, x_caini = ?, data_plecare = ?,locatie_poza = ?, gen = ? WHERE id = ?';
      [result] = await connection.execute(updateQuery, [req.body.nume_caine, req.body.data_nasterii, req.body.castrat, req.body.talie, req.body.x_pisici, req.body.x_caini, req.body.data_plecare,req.body.locatie_poza, req.body.gen, req.params.id]);
    }

    connection.end();

    if (result.affectedRows === 0) {
      // If no rows were affected, the ID was not found
      res.status(404).json({ error: 'ID not found' });
    } else {
      // Send a success response
      res.json({ success: true });
    }
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


//make a function to insert data into the database
app.post('/insertData', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const insertQuery = 'INSERT INTO catei (nume_caine, data_nasterii, castrat, talie, x_pisici, x_caini, data_plecare,locatie_poza, gen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const [result] = await connection.execute(insertQuery, [req.body.nume_caine, req.body.data_nasterii, req.body.castrat, req.body.talie, req.body.x_pisici, req.body.x_caini, req.body.data_plecare, req.body.locatie_poza, req.body.gen]);
    connection.end();

    // Send a success response
    res.json({ success: true });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});