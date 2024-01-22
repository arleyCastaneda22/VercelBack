import { Schema, model } from "mongoose";

const servicioSchema=new Schema({
    nombre_servicio:{
        type:String,
        require:true
    },
    duracion:{
        type:String,
        require:true,
    },
    precio:{
        type:Number,
        require:true
    },
    estado:{
        type:Boolean,
        default:true
    },
    estilista:[ {
        type: Schema.Types.ObjectId,  // Tipo de referencia ObjectId
        ref: 'Estilista',  // Nombre del modelo a referenciar
        required: true
    }]
},{
    timestamps:true,
    versionKey:false
})

export default model('Servicio', servicioSchema)