import mongoose from 'mongoose';


mongoose.connect(process.env.URI_MONGO)
  .then(db => console.log('Database is Connected'))
  .catch(err => console.error('Error de conexión a la base de datos:', err));