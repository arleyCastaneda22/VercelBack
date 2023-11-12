import { Schema, model } from "mongoose";

const clienteSchema = new Schema({
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
    direccion: {
        type:String,
    
    },
    estado: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
        versionKey: false
    })

export default model('Cliente', clienteSchema)