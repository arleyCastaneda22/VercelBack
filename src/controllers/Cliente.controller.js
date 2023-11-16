import Cliente from "../models/Cliente.js";

export const createCliente = async(req,res)=>{
    try {
        const cliente= Cliente(req.body)
        
        const clienteSave= await cliente.save()
        res.status(201).json(clienteSave)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({mesage:error.mesage})
        
    }
}

export const listarCliente= async(req, res)=>{
    try {
        const cliente= await Cliente.find();
        res.status(200).json(cliente)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}

export const listarUnCliente=async(req,res)=>{
    try {
        const id = req.params.id;
        const cliente = await Cliente.findById(id);
        res.status(200).send(cliente)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}

export const editarCliente=async(req,res)=>{
    try {
        const id=req.params.id;
        const actualizadoCliente= await Cliente.findByIdAndUpdate(id, req.body);
        res.status(204).json(actualizadoCliente);
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}

export const eliminarCliente=async(req,res)=>{
    try {
        const id =req.params.id;
        const eliminadoCliente=await Cliente.deleteOne({_id:id});
        res.status(204).json(eliminadoCliente);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}

export const actualizarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        // Actualiza el estado en la base de datos
        const clienteActualizado = await Cliente.findByIdAndUpdate(
            id,
            { estado },
            { new: true } // Para obtener el cliente actualizado
        );

        res.status(200).json({ estado: clienteActualizado.estado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
