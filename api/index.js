import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth.route.js'; 
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';

dotenv.config();

const app = express();
app.use(bodyParser.json());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

// Connect to the database
const connectToDB = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');
    return connection;
  } catch (err) {
    console.error('Error connecting to MySQL:', err.message);
    process.exit(1); // Exit the process if the connection fails
  }
};

connectToDB(); // Establish MySQL connection

app.use('/api/auth', authRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000!');
});
