
import Estilista from'../models/Estilista.js'
import { validationResult } from 'express-validator';

//Para crear estilista

export const createEstilista = async (req, res) => {
  try {
    // Validar el cuerpo de la solicitud
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const estilista = new Estilista(req.body);

    const estilistaSave = await estilista.save();
    res.status(201).json(estilistaSave);

  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.email === 1) {
        return res.status(400).json({ error: 'El correo electrónico ya está en uso.' });
      }
      res.status(500).json({ error: 'Error interno del servidor.' });

  }
};
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
    try {
        const id=req.params.id;
        const actualizadoEstilista= await Estilista.findByIdAndUpdate(id, req.body);
        if (!actualizadoEstilista) {
            return res.status(404).json({ error: 'Estilista no encontrado.' });
          }
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



