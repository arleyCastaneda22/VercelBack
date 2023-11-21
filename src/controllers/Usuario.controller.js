import User from '../models/User.js'


export const listarUsuarios = async(req, res)=>{
    try {
        const user= await User.find();
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
        res.status(200).send(cliente)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}

export const editarUsuario=async(req,res)=>{
    try {
        const id=req.params.id;
        const actualizadoUser= await User.findByIdAndUpdate(id, req.body);
        res.status(204).json(actualizadoUser);
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}


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