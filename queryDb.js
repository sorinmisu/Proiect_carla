const mysql = require('mysql2/promise');
const express = require('express')
const app = express()
const port = 3000

// Replace these with your MariaDB connection details
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'magazin',
};



// Define a route to serve the Catei.html page and Catei.css file
app.use(express.static(__dirname + '/'));


// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/Catei.html');
//   });
  
  app.get('/getData', async (req, res) => {
    try {
      const connection = await mysql.createConnection(dbConfig);
      const selectQuery = 'SELECT * FROM useri';
      const [rows, fields] = await connection.execute(selectQuery);
      connection.end();
  
      // Send the data as a JSON response
      res.json(rows);
    } catch (error) {
      console.error('Error selecting data:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });