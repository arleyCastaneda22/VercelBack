const express = require('express')
const mongoose = require('mongoose')
const routes = require('./routes/routes')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();

//middleware
app.use(cors());
app.use(cookieParser())
app.use(express.json());

//Rutas
app.use('/api',routes)

//conexion a la base de datos
// require('./database')


mongoose.connect('mongodb://localhost:27017/BeautySoft')
  .then(db => console.log('Database is Connected'))
  .catch(err => console.error('Error de conexión a la base de datos:', err));

  app.listen(3000, () =>{
    console.log("--app is listening on port 3000--")
  })



  




