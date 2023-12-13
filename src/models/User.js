import mongoose from 'mongoose';
import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  nombre: {
    type: String,
  },
  apellido: {
    type: String,
  },
  contrasena: {
    type: String,
    required: true,
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  }],
  estado: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true, // Agrega los campos created at y edited at
});

// Middleware para hash de contraseña antes de guardar
userSchema.pre('save', async function (next) {
  const user = this;

  // Si la contraseña no ha sido modificada, pasa al siguiente middleware
  if (!user.isModified('contrasena')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.contrasena = await bcrypt.hash(user.contrasena, salt);
    next();
  } catch (error) {
    console.error(error);
    next(new Error('Error al hashear la contraseña'));
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.contrasena);
  } catch (error) {
    console.error(error);
    throw new Error('Error al comparar contraseñas');
  }
};

// Exporta el modelo User
export const User = mongoose.model('User', userSchema);

export default model('User', userSchema);
