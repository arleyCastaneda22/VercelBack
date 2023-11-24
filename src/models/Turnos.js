import { Schema, model } from "mongoose";

const turnoSchema = new Schema({
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date,
        required: true
    },

    estilista: [
        {
            type: Schema.Types.ObjectId,  // Tipo de referencia ObjectId
            ref: 'Estilista',  // Nombre del modelo a referenciar
            required: true
        }
    ]

}, {
    timestamps: true,
    versionKey: false
}
)
export default model('Turno', turnoSchema)