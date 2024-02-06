import User from '../models/User.js'
import bcrypt from 'bcryptjs'


export const listarUsuarios = async(req, res)=>{
    try {
        const user= await User.find().populate('roles','nombre');
        res.status(200).json(user)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}

export const listarUnUsuario=async(req,res)=>{
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        res.status(200).send(user)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}

export const editarUsuario = async (req, res) => {
    const id = req.params.id;
    const { email, nombre, apellido,telefono, direccion, contrasena, roles  } = req.body;
    try {

        const existingUser = await User.findOne({ email, _id: { $ne: id } });
        if (existingUser) {
            throw { code: 11000, message: 'Este correo electrónico ya existe' };
        }

        // Verificar si se proporcionó una nueva contraseña
        else if (contrasena) {
            // Hash de la nueva contraseña
            const hashedPassword = await bcrypt.hash(contrasena, 10);
            // Actualizar la contraseña del usuario
            await User.findByIdAndUpdate(id, { contrasena: hashedPassword, email, nombre, apellido, roles});
        } else {
            // Si no se proporcionó una nueva contraseña, actualizar otros datos solamente
            await User.findByIdAndUpdate(id, { email, nombre, apellido, telefono, direccion, roles });
        }

        res.status(204).json({ mensaje: 'Usuario actualizado con éxito' });

    } catch (error) {
        console.log(error.message)

    // Manejar los errores, incluyendo el código 11000 para el email duplicado
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
        let usuario = await User.findOne({ _id: id });
    
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        console.log('ID del usuario:', id);
        console.log('Contraseña antigua:', oldcontrasena);
        console.log('Nueva contraseña:', newcontrasena);


        const contrasenaValida = await bcrypt.compare(oldcontrasena, usuario.contrasena);

        if (!contrasenaValida) {
            console.log("no paso la prueba")
            return res.status(401).json({ error: 'La contraseña antigua no es válida' });
        }else{
            // Hash de la nueva contraseña
            const hashedPassword = await bcrypt.hash(newcontrasena, 10);
            
            // Actualizar la contraseña del usuario
            await User.findByIdAndUpdate(id, { $set: { contrasena: hashedPassword } });
            console.log("siiiiiiiiiiiiiiiii")
            res.status(204).json({ mensaje: 'Contraseña actualizada con éxito' });
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error de al acttualizar la contraseña ' });
    }
};


export const eliminarUsuario=async(req,res)=>{
    try {
        const id =req.params.id;
        const eliminadoUsuario=await User.deleteOne({_id:id});
        res.status(204).json(eliminadoUsuario);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}


export const actualizarEstado=async(req,res)=>{
    try {
        const id = req.params.id;
        const actualizadoEstado = await User.findById(id)
        actualizadoEstado.estado=!actualizadoEstado.estado;
        await actualizadoEstado.save()
        res.status(204).json(actualizadoEstado);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}

