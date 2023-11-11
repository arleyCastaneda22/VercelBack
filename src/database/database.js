import mongoose from 'mongoose';

// try {
//     await mongoose.connect(process.env.URI_MONGO)
//         console.log('Database is Connected');
// } catch (error) {
//     console.log('Error de conexión a la base de datos:'+ error)
// }


mongoose.connect(process.env.URI_MONGO)
  .then(db => console.log('Database is Connected'))
  .catch(err => console.error('Error de conexión a la base de datos:', err));