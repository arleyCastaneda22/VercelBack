import "dotenv/config";
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
//modulos
import EstilistaRouter from './routes/estilista.routes.js'
import ClienteRouter from './routes/cliente.routes.js'
import authRouther from './routes/auth.routes.js'
// Database connection
import('./database/database.js');

const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'))

//Rutas
app.use('/',authRouther)

app.use('/api', EstilistaRouter)

app.use('/api', ClienteRouter)

app.use('/api', ServicioRouter)

// Routes
// app.use('/api', routes);
app.use(cors({
  origin: 'http://localhost:4200', // Cambia esta URL por la URL de tu aplicación Angular
  credentials: true
}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("App is listening on port " + PORT);
});
