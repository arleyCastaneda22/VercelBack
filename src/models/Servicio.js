import { Schema, model } from "mongoose";

const servicioSchema=new Schema({
    nombre_servicio:{
        type:String,
        lowerCase:true,
        require:true,
    },
    duracion:{
        type:Number,
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

servicioSchema.pre('save', function (next) {
    this.nombre_servicio = this.nombre_servicio.toLowerCase();
    next();
});
export default model('Servicio', servicioSchema)