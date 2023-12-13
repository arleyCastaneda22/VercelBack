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
    try {
        const id = req.params.id;
        const { contrasena, ...restoDatos } = req.body;

        // Verificar si se proporcionó una nueva contraseña
        if (contrasena) {
            // Hash de la nueva contraseña
            const hashedPassword = await bcrypt.hash(contrasena, 10);
            // Actualizar la contraseña del usuario
            await User.findByIdAndUpdate(id, { contrasena: hashedPassword, ...restoDatos });
        } else {
            // Si no se proporcionó una nueva contraseña, actualizar otros datos solamente
            await User.findByIdAndUpdate(id, restoDatos);
        }

        res.status(204).json({ mensaje: 'Usuario actualizado con éxito' });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }
};

export const actualizarContraseña = async (req, res) => {
    const { id, token } = req.params;
    const { contrasena } = req.body;

    try {
        // Verificar el token
        jwt.verify(token, 'secreto');

        // Hash de la nueva contraseña
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        // Actualizar la contraseña del usuario
        await User.findByIdAndUpdate(id, { $set: { contrasena: hashedPassword } });

        res.status(204).json({ mensaje: 'Contraseña actualizada con éxito' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error de servidor' });
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
