const moongoose = require('mongoose')
const {Schema, model} = require('mongoose');

const userSchema = new moongoose.Schema({
    // id_usuario: {
    //     type: Number,
    //     required: true,
    // },
    correo_usuario: {
        type: String,
        unique:true,
        required:true
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
})

module.exports = moongoose.model('User', userSchema);
