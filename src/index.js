import "dotenv/config";
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
//modulos
import { createRoles }  from './libs/initialSetup.js'
import EstilistaRouter from './routes/estilista.routes.js'
import ClienteRouter from './routes/cliente.routes.js'
import authRouther from './routes/auth.routes.js'
import ServicioRouter from './routes/servicio.routes.js'
import UsuarioRouter from './routes/usuario.routes.js'
import RoleRouter from './routes/role.routes.js'
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

//Rutas
app.use('/',authRouther)

app.use('/api', EstilistaRouter)

app.use('/api', ClienteRouter)

app.use('/api', ServicioRouter)
app.use('/api', UsuarioRouter )

app.use('/api',RoleRouter)

// Routes
// app.use('/api', routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("App is listening on port " + PORT);
});
