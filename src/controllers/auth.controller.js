import { User } from "../models/User.js"
import { validationResult } from "express-validator"
import jwt from 'jsonwebtoken'




export const register = async(req,res) =>{

    //alternativa validacion buscando por email

    const {email,nombre,apellido,contrasena} = req.body
    try {
        let user = await User.findOne({email});

        if(user) throw { code: 11000};


        user = new User({email,nombre,apellido,contrasena});
        await user.save()
        

        //jwt

        return res.status(201).json({ok: true})
    } catch (error) {
        console.log(error.menssage);
        // alternatica por defecto, por codigos de error de mongoose
        if(error.code === 11000){
            return res.status(400).json({error: 'Este correo electronico ya existe'})
        }
        //respuesta por defecto
        return res.status(500).json({error: "Error de servidor"})
    }
    res.json({ok:"regiser works"})
}



export const login = async (req,res) =>{
    try {
        const {email,contrasena} = req.body

        let user = await User.findOne({email});

        if(!user)
            return res.status(403).json({ error:'El usuario NO existe'});
        
        const respuestaPassword = await user.comparePassword(contrasena);

        if(!respuestaPassword)
            return res.status(403).json({ error:'Contraseña incorrecta'});
        
        //generar el token
                                                //esto lo debemos cambiar
        const token = jwt.sign({uid: user._id}, "process.env.JWT_SECRET")

        return  res.json({token})

        res.cookie("jwt", token,{
            httpOnly:true,
            maxAge:24*60*60*1000
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Error de servidor"})

    }
    return res.json({ok:"login works"})
};
