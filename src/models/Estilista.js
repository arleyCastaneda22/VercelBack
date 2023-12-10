import { Schema, model } from "mongoose";
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs'

const estilistaSchema = new Schema({
    nombre: {
        type: String,
        require: true,

    },
    apellido: {
        type: String,
        require: true

    },
    telefono: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    contrasena: {
        type: String,
        required:true
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
    }],
    estado: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
        versionKey: false
    });


    //cuando se aplica el save del controller, primero entra en este pre que valida antes de guardar, si se esta modificando
//para no volver a hashear la contraseña
estilistaSchema.pre("save", async function(next){

    const estilista = this;

    if(!estilista.isModified('contrasena')) return next();

    try{
        const salt = await bcryptjs.genSalt(10)
        estilista.contrasena = await bcryptjs.hash(estilista.contrasena,salt)
        next();
    }catch(error){
        console.log(error)
        throw new Error('falló el hash de contraseña')
        
    }
});


estilistaSchema.methods.comparePassword = async function(candidatePassword){
    return await bcryptjs.compare(candidatePassword, this.contrasena);
};

export default model('Estilista', estilistaSchema)


