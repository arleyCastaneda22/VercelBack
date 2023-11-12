import "dotenv/config";
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import EstilistaRouter from './routes/estilista.routes.js'
import ClienteRouter from './routes/cliente.routes.js'
// Database connection
import('./database/database.js');

const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

//Rutas
app.use('/api', EstilistaRouter)

app.use('/api', ClienteRouter)

// Routes
// app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("App is listening on port " + PORT);
});
