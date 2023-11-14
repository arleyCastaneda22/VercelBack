
import Estilista from'../models/Estilista.js'

//Para crear estilista
export const createEstilista = async(req,res)=>{
    try {
        const estilista= Estilista(req.body)
        
        const estilistaSave= await estilista.save()
        res.status(201).json(estilistaSave)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({mesage:error.mesage})
        
    }
}

export const listarEstilista= async(req, res)=>{
    try {
        const estilista= await Estilista.find();
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
        res.status(200).send(estilista)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}

export const editarEstilista=async(req,res)=>{
    try {
        const id=req.params.id;
        const actualizadoEstilista= await Estilista.findByIdAndUpdate(id, req.body);
        res.status(204).json(actualizadoEstilista);
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}

export const eliminarEstilista=async(req,res)=>{
    try {
        const id =req.params.id;
        const eliminadoEstilista=await Estilista.deleteOne({_id:id});
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



