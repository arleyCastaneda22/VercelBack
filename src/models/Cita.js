import { Schema, model } from "mongoose";

const citaSchema = new Schema({
    cliente: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    servicio: {
        type: Schema.Types.ObjectId,
        ref: 'Servicio'
    },
    estilista: {
        type: Schema.Types.ObjectId,
        ref: 'Estilista'
    },
    fechaCita: {
        type: Date,
        required: true
    },
    horaCita: {
        type: Date,
        required: true,
    },
    horaFinCita: {
        type: Date, // Nueva propiedad para la hora de finalización
        required: true,
    },
    estado: {
        type: String,
        enum: ['confirmada', 'cancelada', 'pendiente'],
        default: 'pendiente',
    },
    turno: {
        type: Schema.Types.ObjectId,
        ref: 'Turno'
    },
}, {
    timestamps: true,
    versionKey: false
});

// Agrega el índice compuesto
citaSchema.index({ estilista: 1, fechaCita: 1, horaCita: 1, servicio: 1 }, { unique: true });

export default model('Cita', citaSchema);

