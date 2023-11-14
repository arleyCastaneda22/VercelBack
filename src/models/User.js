import mongoose from 'mongoose';
import {Schema, model} from 'mongoose';
import bcryptjs from 'bcryptjs'

const userSchema = new mongoose.Schema({
    // id_usuario: {
    //     type: Number,
    //     required: true,
    // },
    email: {
        type: String,
        unique:true,
        required:true,
        trim:true,

    },
    nombre: {
        type: String,
    },
    apellido: {
        type: String,
    },
    contrasena: {
        type: String,
        required:true
    },
    // id_rol: {
    //     type: Number,
    //     required: true,
    // },
    // foto_perfil: {
    //     type: String,
    //     max: 200,
    // },
    // estado: {
    //     type: Number,
    //     default: 1,
    // },
},{
    //funcion que agrega los campos created at y edited at
    timestamps:true
});

//cuando se aplica el save del controller, primero entra en este pre que valida antes de guardar, si se esta modificando
//para no volver a hashear la contraseña
userSchema.pre("save", async function(next){
    const user = this

    if(!user.isModified('contrasena')) return next()
    try{
        const salt = await bcryptjs.genSalt(10)
        user.contrasena = await bcryptjs.hash(user.contrasena,salt)
        next()
    }catch(error){
        console.log(error)
        throw new Error('falló el hash de contraseña')
        
    }
});


userSchema.methods.comparePassword = async function(candidatePassword){
    return await bcryptjs.compare(candidatePassword, this.contrasena);
};

// module.exports = moongoose.model('User', userSchema);
export const User = mongoose.model('User',userSchema)
