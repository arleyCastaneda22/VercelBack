import "dotenv/config";
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// Database connection
import('./database/database.js');

const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Routes
// app.use('/api', routes);


// mongoose.connect('mongodb://localhost:27017/BeautySoft')
//   .then(db => console.log('Database is Connected'))
//   .catch(err => console.error('Error de conexión a la base de datos:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("App is listening on port " + PORT);
});
