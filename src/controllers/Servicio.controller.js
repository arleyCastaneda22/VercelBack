import Servicio from '../models/Servicio.js'
import fs from 'fs';


//Listar servicio
export const listarServicio = async (req, res) => {
    try {
        const servicio = await Servicio.find().populate('estilista');
        return res.status(200).json(servicio)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }
}

export const listarUnServicio=async(req,res)=>{
    try {
        const id = req.params.id;
        const servicio = await Servicio.findById(id).populate('estilista');
        res.status(200).send(servicio)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}

//Crear servicio
export const createServicio = async(req,res)=>{
    try {
   
        const servicio= Servicio(req.body)     
        const servicioSave= await servicio.save()
        return res.status(201).json(servicioSave)
        
    } catch (error) {
        console.log(error)
         return res.status(500).json({mesage:error.mesage})
        
    }
}



//Actualizar servicio
export const editarServicio=async(req,res)=>{
    try {
        const id=req.params.id;
        const actualizadoServicio= await Servicio.findByIdAndUpdate(id, req.body);
        res.status(204).json(actualizadoServicio);
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}
//Eliminar servicio
export const eliminarServicio = async (req, res) => {
    try {
        const id = req.params.id;
        await eliminarImagen(id);
        const eliminadoServicio = await Servicio.deleteOne({ _id: id });
        if (eliminadoServicio.deletedCount > 0) {
            res.status(204).json({ message: 'Servicio eliminado exitosamente' });
        } else {
            res.status(404).json({ message: 'Servicio no encontrado' });
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }
}



