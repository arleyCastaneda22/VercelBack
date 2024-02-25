import Servicio from '../models/Servicio.js'
import Estilista from '../models/Estilista.js'
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
export const createServicio = async (req, res) => {
    try {
        const { nombre_servicio, duracion, precio, estilista } = req.body;

        // Verifica si ya existe un servicio con el nombre_servicio proporcionado
        const servicioExistente = await Servicio.findOne({ nombre_servicio: nombre_servicio });

        if (servicioExistente) {
            return res.status(400).json({ error: 'El nombre del servicio ya existe' });
        }

        const nuevoServicio = new Servicio({
            nombre_servicio: nombre_servicio,
            duracion: duracion,
            precio: precio,
            estilista: estilista
        });

     
        const servicioGuardado = await nuevoServicio.save();

        return res.status(201).json(servicioGuardado);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};



//Actualizar servicio
export const editarServicio = async (req, res) => {
    try {
        const id = req.params.id;

        const servicioExistente = await Servicio.findOne({ nombre_servicio: req.body.nombre_servicio });

        if (servicioExistente && servicioExistente._id != id) {
            return res.status(400).json({ error: 'El nombre del servicio ya existe' });
        }

        // Realiza la actualización del servicio
        const actualizadoServicio = await Servicio.findByIdAndUpdate(id, req.body, { new: true });

        if (!actualizadoServicio) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }

        return res.status(200).json(actualizadoServicio);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};
//Eliminar servicio
export const eliminarServicio = async (req, res) => {
    try {
        const id = req.params.id;
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
export const actualizarEstado=async(req,res)=>{
    try {
        const id = req.params.id;
        const actualizadoEstado = await Servicio.findById(id)
        actualizadoEstado.estado=!actualizadoEstado.estado;
        await actualizadoEstado.save()
        res.status(204).json(actualizadoEstado);
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error.message})
    }
}

export const estilistaPorServicio =async(req, res)=>{
    try {
        const servicioId = req.params.servicioId;

        
        const servicio = await Servicio.findById(servicioId).populate('estilista');

        if (!servicio) {
            
            return res.status(404).json({ message: 'Servicio no encontrado' });
        }

        // Obtiene el estilista asociado al servicio
        const estilista = servicio.estilista;

        if (!estilista) {
            
            return res.status(404).json({ message: 'Estilista no encontrado' });
        }

        res.status(200).json(estilista);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}




