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
        type: Boolean,
        default: true
    },
    turno: {
        type: Schema.Types.ObjectId,
        ref: 'Turno'
    },
}, {
    timestamps: true,
    versionKey: false
});

export default model('Cita', citaSchema);

