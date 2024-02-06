
import Estilista from'../models/Estilista.js'
import { Role } from '../models/Role.js' 
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

//Para crear estilista
export const createEstilista = async (req, res) => {
    const { email, nombre, apellido, telefono, contrasena } = req.body;
    
    try {

        // Verificar si el estilista ya existe
        let estilistaExistente = await Estilista.findOne({ email });

        // Si encuentra el email, arroja un error indicando que el correo ya existe
        if (estilistaExistente) {
            throw { code: 11000 };
        }

        // Crear un nuevo estilista
        const nuevoEstilista = new Estilista({ email, nombre, apellido, contrasena, telefono });

        // Obtener el rol por defecto "estilista"
        const defaultRole = await Role.findOne({ nombre: 'estilista' });

        // Verificar que el rol por defecto esté creado
        if (!defaultRole) {
            throw new Error('Rol por defecto "estilista" no encontrado');
        }

        // Asignar el rol al estilista
        nuevoEstilista.roles = [defaultRole._id];

        // Guardar el estilista en la base de datos
        await nuevoEstilista.save();

        // Generar el token JWT
        const token = jwt.sign(
            {
                _id: nuevoEstilista._id,
                roles: nuevoEstilista.roles.map(role => role.nombre)
            },
            'tu_clave_secreta_aqui',
            { expiresIn: '24h' }
        );

        console.log(nuevoEstilista);

        // Enviar la respuesta con el token
        res.status(201).json({ token });
    } catch (error) {
        console.log(error.message);
        // Manejar los errores, incluyendo el código 11000 para el email duplicado
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Este correo electrónico ya existe' });
        }
        // Respuesta por defecto en caso de otros errores
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const listarEstilista= async(req, res)=>{
    try {
        const estilista= await Estilista.find()
         return res.status(200).json(estilista)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}

export const listarUnEstilista=async(req,res)=>{
    try {
        const id = req.params.id;
        const estilista = await Estilista.findById(id);
        if (!estilista) {
            return res.status(404).json({ error: 'Estilista no encontrado.' });
          }
        res.status(200).send(estilista)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}

export const editarEstilista=async(req,res)=>{
    const id=req.params.id;
    const { email, nombre, apellido,telefono, contrasena, roles  } = req.body;
    try {

        const existingEstilista = await Estilista.findOne({ email, _id: { $ne: id } });

        if (existingEstilista) {
            throw { code: 11000, message: 'Este correo electrónico ya existe' };
        }

         // Verificar si se proporcionó una nueva contraseña
        else if (contrasena) {
            // Hash de la nueva contraseña
            const hashedPassword = await bcrypt.hash(contrasena, 10);
            // Actualizar la contraseña del usuario
            await Estilista.findByIdAndUpdate(id, { contrasena: hashedPassword, email, nombre, apellido, telefono, roles});
        } else {
            // Si no se proporcionó una nueva contraseña, actualizar otros datos solamente
            await Estilista.findByIdAndUpdate(id, { email, nombre, apellido,telefono,roles });
        }

        res.status(204).json({ mensaje: 'Usuario actualizado con éxito' });

    } catch (error) {
        console.log(error)

        if (error.code === 11000) {
            return res.status(400).json({ error: 'Este correo electrónico ya existe' });
        }
            return res.status(500).json({ message: error.message })
        }
    };

    export const actualizarContraseña = async (req, res) => {
        const { id } = req.params;
        const { oldcontrasena, newcontrasena } = req.body;
    
        try {
            let estilista = await Estilista.findOne({ _id: id });
        
            if (!estilista) {
                return res.status(404).json({ error: 'Estilista no encontrado' });
            }
    
            console.log('ID del usuario:', id);
            console.log('Contraseña antigua:', oldcontrasena);
            console.log('Nueva contraseña:', newcontrasena);
    
    
            const contrasenaValida = await bcrypt.compare(oldcontrasena, estilista.contrasena);
    
            if (!contrasenaValida) {
                console.log("no paso la prueba")
                return res.status(401).json({ error: 'La contraseña antigua no es válida' });
            }else{
                // Hash de la nueva contraseña
                const hashedPassword = await bcrypt.hash(newcontrasena, 10);
                
                // Actualizar la contraseña del usuario
                await Estilista.findByIdAndUpdate(id, { $set: { contrasena: hashedPassword } });
                console.log("siiiiiiiiiiiiiiiii")
                res.status(204).json({ mensaje: 'Contraseña actualizada con éxito' });
            }
            
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Error de al acttualizar la contraseña ' });
        }
    };

export const eliminarEstilista=async(req,res)=>{
    try {
        const id =req.params.id;
        const eliminadoEstilista=await Estilista.deleteOne({_id:id});
        if (!eliminadoEstilista) {
            return res.status(404).json({ error: 'Estilista no encontrado.' });
        }
        res.status(204).json(eliminadoEstilista);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}

export const actualizarEstado=async(req,res)=>{
    try {
        const id = req.params.id;
        const actualizadoEstado = await Estilista.findById(id)
        actualizadoEstado.estado=!actualizadoEstado.estado;
        await actualizadoEstado.save()
        res.status(204).json(actualizadoEstado);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}




