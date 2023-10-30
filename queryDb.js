const mysql = require('mysql2/promise');
const express = require('express')
const app = express()
const port = 3000
app.use(express.json());

let login_status = -1;
let username = '';

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
    if (req.body.locatie_poza == '') {
      updateQuery = 'UPDATE catei SET nume_caine = ?, data_nasterii = ?, castrat = ?, talie = ?, x_pisici = ?, x_caini = ?, data_plecare = ?, gen = ? WHERE id = ?';
      [result] = await connection.execute(updateQuery, [req.body.nume_caine, req.body.data_nasterii, req.body.castrat, req.body.talie, req.body.x_pisici, req.body.x_caini, req.body.data_plecare, req.body.gen, req.params.id]);
    }
    else {
      updateQuery = 'UPDATE catei SET nume_caine = ?, data_nasterii = ?, castrat = ?, talie = ?, x_pisici = ?, x_caini = ?, data_plecare = ?,locatie_poza = ?, gen = ? WHERE id = ?';
      [result] = await connection.execute(updateQuery, [req.body.nume_caine, req.body.data_nasterii, req.body.castrat, req.body.talie, req.body.x_pisici, req.body.x_caini, req.body.data_plecare, req.body.locatie_poza, req.body.gen, req.params.id]);
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

//create a function that will be called when I click the login button on the html page
app.post('/login', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const selectQuery = 'SELECT * FROM useri WHERE (username = ? OR email = ?) AND parola = ?';
    const [rows, fields] = await connection.execute(selectQuery, [req.body.username, req.body.username, req.body.password]);
    connection.end();

    if (rows.length === 1) {
      //get tip_cont from the database and save it in login_status
      login_status = rows[0].tip_cont;
      username = rows[0].username;
    }
    else {
      // Send the data as a JSON response if the username or email and password are correct
      res.json(rows);
    }


    if (rows.length === 0) {
      // Send an error response if the username or email and password are incorrect
      res.status(401).json({ error: 'Invalid username or email and password' });
    } else {
      // Send the data as a JSON response if the username or email and password are correct
      res.json(rows);
    }
  } catch (error) {
    console.error('Error selecting data:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

//make a function that will return the login_status variable
app.get('/getLoginStatus', async (req, res) => {
  res.json({ login_status, username });
});

//make a function that will set login_status variable to -1
app.get('/logout', async (req, res) => {
  login_status = -1;
  res.json(login_status);
});



//create a function that will be called when I click the register button on the html page
app.post('/register', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const insertQuery = 'INSERT INTO useri (username, parola, email,tip_cont) VALUES (?, ?, ?)';
    const [result] = await connection.execute(insertQuery, [req.body.username, req.body.password, req.body.email]);
    connection.end();

    if (result.affectedRows === 1) {
      // Send a success response if the user was registered successfully
      res.json({ message: 'User registered successfully' });
    } else {
      // Send an error response if the user was not registered
      res.status(500).json({ error: 'An error occurred while registering the user' });
    }
  } catch (error) {
    console.error('Error inserting data:', error);
    // Send an error response if an error occurred while inserting the data
    res.status(500).json({ error: 'An error occurred while registering the user' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});