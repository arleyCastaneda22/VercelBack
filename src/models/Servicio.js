import { Schema, model } from "mongoose";

const servicioSchema=new Schema({
    imagen:{
        type:String
    },
    nombre_servicio:{
        type:String,
        require:true
    },
    duracion:{
        type:Date,
        require:true
    },
    precio:{
        type:Number,
        require:true
    },
    estado:{
        type:Boolean,
        default:true
    },
    estilista:{
        type:String,
        require:true
    }
},{
    timestamps:true,
    versionKey:false
})

export default model('Servicio', servicioSchema)