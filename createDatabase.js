const mysql = require('mysql2/promise');

// Replace these with your MariaDB connection details
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'magazin'  // Replace 'test' with the name of the database you want to create
};

async function createDatabase() {
    try {
        const connection = await mysql.createConnection(dbConfig);

        // SQL query to create a new database
        const createDatabaseSQL = `CREATE DATABASE IF NOT EXISTS ${dbConfig.database};`;

        await connection.query(createDatabaseSQL);
        console.log(`Database "${dbConfig.database}" created successfully.`);

        connection.end();
    } catch (error) {
        console.error('Error creating database:', error);
    }
}

createDatabase();
