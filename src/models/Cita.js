import { Schema, model } from "mongoose";

const citaSchema = new Schema({
    cliente:{
        type:Schema.Types.ObjectId,
        ref:'Cliente'
    },

    Servicio:{
        type:Schema.Types.ObjectId,
        ref:'Servicio'
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
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});


export default model('Cita', citaSchema);
