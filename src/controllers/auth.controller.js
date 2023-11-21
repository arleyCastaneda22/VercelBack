import { User } from "../models/User.js"
import { validationResult } from "express-validator"
import jwt from 'jsonwebtoken'




export const register = async(req,res) =>{

    //alternativa validacion buscando por email

    const {email,nombre,apellido,contrasena} = req.body
    try {
        //verifica si el usuario existe
        let user = await User.findOne({email});

        if(user) 
        throw { code: 11000};

        //si no crea un nuevo usuario(objeto)
        user = new User({email,nombre,apellido,contrasena});
        await user.save()
        

        //genera el token jwt
        const token = jwt.sign({_id: user._id}, 'secretKey')

        res.status(201).json({token})

        //maneja los errores
    } catch (error) {
        console.log(error.menssage);
        // alternatica por defecto, por codigos de error de mongoose
        if(error.code === 11000){
            return res.status(400).json({error: 'Este correo electronico ya existe'})
        }
        //respuesta por defecto
        return res.status(500).json({error: "Error de servidor"})
    }

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
                                                
        const token = jwt.sign({_id: user._id}, "secretKey")

        return res.status(200).json({token})


        
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Error de servidor"})

    }
    return res.json({ok:"login works"})
};

export function verifyToken(req,res,next){
    if(!req.headers.authorization){
        return res.status(401).send('unAuthorize request')
    }
    const token = req.headers.authorization.split(' ')[1]

    if(token == 'null'){
        return res.status(401).send('unAuthorize request')
    }

    const payload = jwt.verify(token,'secretKey')
    
    req.userId = payload._id;
    next();
}
