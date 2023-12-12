import { Schema, model } from "mongoose";

const ventasSchema = new Schema({

    cliente: {
        type: Schema.Types.ObjectId,  // Tipo de referencia ObjectId
        ref: 'Cliente',  // Nombre del modelo a referenciar
        required: true
    },
    servicio: {
        type: Schema.Types.ObjectId,  // Tipo de referencia ObjectId
        ref: 'Servicio',  // Nombre del modelo a referenciar
        required: true
    },
    metodoPago:{
        type:String,
        required:true
    },
    estado: {
        type: Boolean,
        default: false
    },
},{
    timestamps:true,
    versionKey:false
})

export default model('Ventas', ventasSchema)
