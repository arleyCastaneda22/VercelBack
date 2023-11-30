import mongoose from 'mongoose';
import {Schema, model} from 'mongoose';
import bcryptjs from 'bcryptjs'

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        unique:true,
        required:true,
        trim:true,
    },
    nombre: {
        type: String,
    },
    // telefono:{
    //     type:String,
    // },
    apellido: {
        type: String,
    },
    contrasena: {
        type: String,
        required:true
    },
    roles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
    }],
    // foto_perfil: {
    //     type: String,
    //     max: 200,
    // },
    estado: {
        type: Boolean,
        default: true,
    },
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

export default model('User', userSchema)
