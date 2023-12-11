import { User } from "../models/User.js"
import { Role } from '../models/Role.js' 
import Estilista from'../models/Estilista.js'
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



export const login = async (req, res) => {
    try {
        const { email, contrasena } = req.body;

        // Autenticación de usuario
        let usuario = await User.findOne({ email }).populate("roles");

        if (!usuario.estado) {
            return res.status(400).json({ error: 'El usuario está inactivo' });
        }

        // Si el usuario no existe, intenta encontrar un estilista con el mismo correo electrónico
        if (!usuario) {
            let estilista = await Estilista.findOne({ email }).populate("roles");

            // Si el estilista no existe, las credenciales son inválidas
            if (!estilista) {
                return res.status(403).json({ error: 'Credenciales inválidas' });
            }

             // Verificar si el estilista está inactivo
             if (!estilista.estado) {
                return res.status(400).json({ error: 'El estilista está inactivo' });
            }

            // Compara las contraseñas del estilista
            const contrasenaValida = await estilista.comparePassword(contrasena);

            // Si la contraseña es válida, genera el token JWT
            if (contrasenaValida) {
                const token = jwt.sign(
                    {
                        _id: estilista._id,
                        roles: estilista.roles.map(role => role.nombre)
                    },
                    'secretKey',
                    { expiresIn: '24h' }
                );

                return res.status(200).json({ token });
            } else {
                return res.status(403).json({ error: 'Credenciales inválidas' });
            }
        }

        // Compara las contraseñas del usuario
        const respuestaPasswordUsuario = await usuario.comparePassword(contrasena);

        // Si la contraseña del usuario es válida, genera el token JWT
        if (respuestaPasswordUsuario) {
            const token = jwt.sign(
                {
                    _id: usuario._id,
                    roles: usuario.roles.map(role => role.nombre)
                },
                'secretKey',
                { expiresIn: '24h' }
            );

            return res.status(200).json({ token });
        } else {
            return res.status(403).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: 'Error de servidor' });
    }
};


