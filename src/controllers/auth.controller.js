import { User } from "../models/User.js"
import { Role } from '../models/Role.js' 
import { validationResult } from "express-validator"
import jwt from 'jsonwebtoken'




export const register = async(req,res) =>{

    //alternativa validacion buscando por email

    const {email,nombre,apellido,contrasena, roles} = req.body
    try {
        //verifica si el usuario existe
        let user = await User.findOne({email});
        //si encuentra el email que estamos registrando arroja el error que ya el correo existe
        if(user) 
        throw { code: 11000};

        //Si no existe, crea un nuevo usuario (objeto)
        user = new User({email,nombre,apellido,contrasena});

        //verifica que el rol este en la lista de roles
        if(roles){
            const foundRoles = await Role.find({nombre: {$in: roles}})
            user.roles = foundRoles.map(role => role._id)
        }else{
            // Obtiene el rol por defecto (cliente)
        const defaultRole = await Role.findOne({ nombre: 'cliente' });

        //verifica que el rol por defecto se encuentre creado
        if (!defaultRole) {
            throw new Error('Rol por defecto no encontrado');
        }

        // Asigna el rol al usuario
        user.roles = [defaultRole._id];
        }

        //guardar usuario
        await user.save()

        //genera el token jwt
        const token = jwt.sign({ _id: user._id, roles: user.roles }, 'secretKey', {
            expiresIn: 86400 // 24 horas
        });

        console.log(user)

        res.status(201).json({token})

        //maneja los errores
    } catch (error) {
        console.log(error.message);
        // alternatica por defecto, por codigos de error de mongoose
        if(error.code === 11000){
            return res.status(400).json({error: 'Este correo electronico ya existe'})
        }
        //respuesta por defecto
        return res.status(500).json({error: "Error interno del servidor"})
    }

}



export const login = async (req,res) =>{
    try {
        const {email,contrasena} = req.body

        let user = await User.findOne({email}).populate("roles");

        //maneja los errores en caso de que no se encuentre el usuario 
        if(!user)
            return res.status(403).json({ error:'El usuario NO existe'});
        
        const respuestaPassword = await user.comparePassword(contrasena);

        //no coincida las contraseñas
        if(!respuestaPassword)
            return res.status(403).json({ error:'Contraseña incorrecta'});
        
        //generar el token
                                                
        const token = jwt.sign({_id: user._id, roles: user.roles}, "secretKey",{
            expiresIn: 86400
        })

        console.log(user)

        return res.status(200).json({token})



        
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({error: "Error de servidor"})

    }
};


