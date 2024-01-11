import mongoose from 'mongoose';
import { Schema, model } from "mongoose";

const citaSchema =new Schema({
    fecha: Date,
    estilista: String,
    servicio: String,
})

const Cita = mongoose.model('Cita', citaSchema);

module.exports = Cita