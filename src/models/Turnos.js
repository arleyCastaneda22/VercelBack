import { Schema, model } from "mongoose";

const turnoSchema = new Schema({
    estilista: {
        type: Schema.Types.ObjectId,
        ref: 'Estilista'
    },
    dia: {
        type: String,
        required: true
    },
    inicioM: {
        type: Date,
        required: true,
        
        
    },
    finM: {
        type: Date,
        required: true
    },
    inicioT: {
        type: Date,
        required: true
    },
    finT: {
        type: Date,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});


export default model('Turno', turnoSchema);
