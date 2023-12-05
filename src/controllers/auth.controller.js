import { User } from "../models/User.js"
import { Role } from '../models/Role.js'
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
        const { email, contrasena } = req.body

        let user = await User.findOne({ email }).populate("roles");

        //maneja los errores en caso de que no se encuentre el usuario 
        if (!user)
            return res.status(403).json({ error: 'El usuario NO existe' });

        const respuestaPassword = await user.comparePassword(contrasena);

        //no coincida las contraseñas
        if (!respuestaPassword)
            return res.status(403).json({ error: 'Contraseña incorrecta' });

        //generar el token

        const token = jwt.sign({
            _id: user._id,
            roles: user.roles.map(role => role.nombre) // Mapear solo los nombres de los roles
        }, 'secretKey', {
            expiresIn: 86400 // 24 horas
        });

        console.log(user)

        return res.status(200).json({ token })




    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: "Error de servidor" })

    }
};

export const recuperarContraseña = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(403).json({ error: 'El usuario NO existe' });
        }

        const token = jwt.sign({ email: user.email, id: user._id }, 'secreto', { expiresIn: '5m' })
        const link = `http://localhost:4200/reset-password/${user._id}/${token}`
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

        res.status(200).json({ ok: true, link })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: "Error de servidor" })
    }

}
export const actualizarContraseña = async (req, res) => {
    const { id, token } = req.params;
    const { contrasena } = req.body

    try {
        // Verificar el token
        const user = await User.findOne({ _id: id });
        if (!user) {
            return res.status(403).json({ error: 'El usuario no existe' });
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





