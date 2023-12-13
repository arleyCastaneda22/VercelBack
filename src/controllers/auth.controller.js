import { User } from "../models/User.js"
import { Role } from '../models/Role.js'
import Estilista from'../models/Estilista.js'
import { transporter } from '../helpers/nodemailer.js'
import bcrypt from 'bcrypt';
import { validationResult } from "express-validator"
import jwt from 'jsonwebtoken'




export const register = async (req, res) => {

    //alternativa validacion buscando por email

    const { email, nombre, apellido, contrasena, roles } = req.body
    try {
        //verifica si el usuario existe
        let user = await User.findOne({ email });
        //si encuentra el email que estamos registrando arroja el error que ya el correo existe
        if (user)
            throw { code: 11000 };

        //Si no existe, crea un nuevo usuario (objeto)
        user = new User({ email, nombre, apellido, contrasena });

        //verifica que el rol este en la lista de roles
        if (roles) {
            const foundRoles = await Role.find({ nombre: { $in: roles } })
            user.roles = foundRoles.map(role => role._id)
        } else {
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

        res.status(201).json({ token })

        //maneja los errores
    } catch (error) {
        console.log(error.message);
        // alternatica por defecto, por codigos de error de mongoose
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Este correo electronico ya existe' })
        }
        //respuesta por defecto
        return res.status(500).json({ error: "Error interno del servidor" })
    }

}



export const login = async (req, res) => {
    try {
        const { email, contrasena } = req.body;

        // Intenta encontrar un usuario con el mismo correo electrónico
        let usuario = await User.findOne({ email }).populate("roles");

        // Si el usuario no existe, intenta encontrar un estilista
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

        // Si el usuario no existe, las credenciales son inválidas
        if (!usuario) {
            return res.status(403).json({ error: 'Credenciales inválidas' });
        }

        // Si el usuario está inactivo, retorna un error
        if (!usuario.estado) {
            return res.status(400).json({ error: 'El usuario está inactivo' });
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


export const recuperarContraseña = async (req, res) => {
    try {
        const { email } = req.body;

        // Buscar usuario
        const user = await User.findOne({ email });

        // Buscar estilista si el usuario no existe
        if (!user) {
            const estilista = await Estilista.findOne({ email });

            if (!estilista) {
                return res.status(403).json({ error: 'El usuario o estilista NO existe' });
            }

            // Generar token y enviar correo para el estilista
            const token = jwt.sign({ email: estilista.email, id: estilista._id }, 'secreto', { expiresIn: '5m' });
            const link = `http://localhost:4200/reset-password/${estilista._id}/${token}`;


  
            const htmlMessage = `
            <p>¡Hola ${estilista.nombre}!</p>
            <p>Hemos recibido una solicitud para restablecer tu contraseña. Para completar este proceso, sigue estos sencillos pasos:</p>
            <ol>
              <li>Haz clic en el siguiente enlace para ir a la página de cambio de contraseña: <a href="${link}">${link}</a></li>
              <li>Ingresa tu nueva contraseña siguiendo nuestras recomendaciones de seguridad.</li>
              <li>Confirma la nueva contraseña.</li>
            </ol>
            <p>Recuerda que tu seguridad es nuestra prioridad. Nunca compartas tu contraseña con nadie y elige contraseñas fuertes y únicas.</p>
            <p>Si necesitas ayuda o tienes alguna pregunta, no dudes en contactarnos.</p>
            <p>Gracias por confiar en nosotros.</p>
            <p>Saludos,<br/>Tu Empresa</p>
          `;
    
            await transporter.sendMail({
                from: '"Cambio de contraseña 👻" <beautysoft262@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Cambio de contraseña", // Subject line
                text: "Hello world?", // plain text body
                html: htmlMessage, // html body
            });

            return res.status(200).json({ ok: true, link });
        }

        // Generar token y enviar correo para el usuario
        const token = jwt.sign({ email: user.email, id: user._id }, 'secreto', { expiresIn: '5m' });
        const link = `http://localhost:4200/reset-password/${user._id}/${token}`;
 
        const htmlMessage = `
        <p>¡Hola ${user.nombre}!</p>
        <p>Hemos recibido una solicitud para restablecer tu contraseña. Para completar este proceso, sigue estos sencillos pasos:</p>
        <ol>
          <li>Haz clic en el siguiente enlace para ir a la página de cambio de contraseña: <a href="${link}">${link}</a></li>
          <li>Ingresa tu nueva contraseña siguiendo nuestras recomendaciones de seguridad.</li>
          <li>Confirma la nueva contraseña.</li>
        </ol>
        <p>Recuerda que tu seguridad es nuestra prioridad. Nunca compartas tu contraseña con nadie y elige contraseñas fuertes y únicas.</p>
        <p>Si necesitas ayuda o tienes alguna pregunta, no dudes en contactarnos.</p>
        <p>Gracias por confiar en nosotros.</p>
        <p>Saludos,<br/>Tu Empresa</p>
      `;

        await transporter.sendMail({
            from: '"Cambio de contraseña 👻" <beautysoft262@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "Cambio de contraseña", // Subject line
            text: "Hello world?", // plain text body
            html: htmlMessage, // html body
        });

        return res.status(200).json({ ok: true, link });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ error: "Error de servidor" });
    }
};
export const actualizarContraseña = async (req, res) => {
    const { id, token } = req.params;
    const { contrasena } = req.body

    try {
        // Verificar el token
        const user = await User.findOne({ _id: id });
        if (!user) {
            const estilista = await Estilista.findOne({ _id:id });
            if(!estilista){
                try {
                    jwt.verify(token, 'secreto');
                } catch (tokenError) {
                    if (tokenError.name === 'TokenExpiredError') {
                        return res.status(401).json({ error: 'El token ha expirado' });
                    } else {
                        throw tokenError; 
                    }
                }
        
                // Hash de la nueva contraseña
                const hashedPassword = await bcrypt.hash(contrasena, 10);
        
                // Actualizar la contraseña del usuario
                await estilista.updateOne({ _id: id }, { $set: { contrasena: hashedPassword } });
        
                res.status(204).json({ mensaje: 'Contraseña actualizada con éxito' });
            }


        }
        try {
            jwt.verify(token, 'secreto');
        } catch (tokenError) {
            if (tokenError.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'El token ha expirado' });
            } else {
                throw tokenError; 
            }
        }

        // Hash de la nueva contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Actualizar la contraseña del usuario
        await User.updateOne({ _id: id }, { $set: { contrasena: hashedPassword } });

        res.status(204).json({ mensaje: 'Contraseña actualizada con éxito' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error de servidor' });
    }
};





