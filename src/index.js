import "dotenv/config";
import express, { Router } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from "morgan";
//modulos
import { createRoles }  from './libs/initialSetup.js'
import EstilistaRouter from './routes/estilista.routes.js'
import ClienteRouter from './routes/cliente.routes.js'
import authRouther from './routes/auth.routes.js'
import ServicioRouter from './routes/servicio.routes.js'
import TurnosRouter from './routes/turno.js'
import UsuarioRouter from './routes/usuario.routes.js'
import RoleRouter from './routes/role.routes.js'
import ventasRouter from './routes/ventas.routes.js'
import CitaRouter from './routes/cita.routes.js'
import dashboardRouter from './routes/dashboard.routes.js'

// Database connection
import('./database/database.js');

const app = express();
//crea roles por defecto
createRoles();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'))
app.use(morgan('status'));

//Rutas
app.use('/',authRouther)

app.use('/api', EstilistaRouter)

app.use('/api', ClienteRouter)

app.use('/api', ServicioRouter)
app.use('/api', UsuarioRouter )
app.use('/api', TurnosRouter)

app.use('/api',RoleRouter)
app.use('/api', ventasRouter)
app.use('/api', CitaRouter)
app.use('/api', dashboardRouter)


// Routes
// app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("App is listening on port " + PORT);
});
