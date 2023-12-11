import { Schema, model } from "mongoose";

const servicioSchema=new Schema({
    nombre_servicio:{
        type:String,
        require:true
    },
    duracion:{
        type:String,
        require:true,
        validate: {
            validator: function (value) {
              // Validar que la cadena tenga el formato HH:MM
              const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
              return regex.test(value);
            },
            message: 'Formato de hora no válido. Debe ser HH:MM.',
          },
    },
    precio:{
        type:Number,
        require:true
    },
    estado:{
        type:Boolean,
        default:true
    },
    estilista: [{
        type: Schema.Types.ObjectId,  // Tipo de referencia ObjectId
        ref: 'Estilista',  // Nombre del modelo a referenciar
        required: true
    }]
},{
    timestamps:true,
    versionKey:false
})

export default model('Servicio', servicioSchema)