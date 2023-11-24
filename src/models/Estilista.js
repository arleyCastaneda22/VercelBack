
import { Schema, model } from "mongoose";

const estilistaSchema = new Schema({
    nombre: {
        type: String,
        require: true,

    },
    apellido: {
        type: String,
        require: true

    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    telefono: {
        type: String,
        require: true,

    },

    estado: {
        type: Boolean,
        default: true
    },
   
},

    {
        timestamps: true,
        versionKey: false
    })

export default model('Estilista', estilistaSchema)


