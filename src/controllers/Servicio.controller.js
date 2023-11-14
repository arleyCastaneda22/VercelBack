import Servicio from '../models/Servicio.js'
import fs from 'fs';


//Listar servicio
export const listarServicio = async (req, res) => {
    try {
        const servicio = await Servicio.find();
        return res.status(200).json(servicio)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }
}

//Crear servicio
export const createServicio = async (req, res) => {
    try {
        const { nombre_servicio, duracion, precio, estilista } = req.body
        const validacion = validar(req.file, 'Y')
        if (validacion == '') {
            const nuevoServicio = new Servicio({
                nombre_servicio: nombre_servicio, duracion: duracion, precio: precio, estilista: estilista,
                imagen: '/uploads/' + req.file.filename
            })
            return await nuevoServicio.save().then(() => {
                res.status(201).json({ status: true, data: nuevoServicio })
            })
        }

        res.status(201).json({ status: true, data: nuevoServicio })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ mesage: error.mesage })
    }


}
//Actualizar servicio
export const actualizarServicio = async (req, res) => {
    try {
        const { id } = req.params
        const { nombre_servicio, duracion, precio, estilista } = req.body
        let imagen = ''
        let valores = { nombre_servicio: nombre_servicio, duracion: duracion, 
            precio: precio, estilista: estilista }
        if (req.file != null) {
            imagen = '/uploads/' + req.file.filename
            valores = { nombre_servicio: nombre_servicio, duracion: duracion, 
                precio: precio, estilista: estilista, imagen: imagen }
            await eliminarImagen(id);
        }
        await Servicio.updateOne({ _id: id }, { $set: valores })
        return res.status(204).json({ status: true, data: Servicio })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ mesage: error.mesage })
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

//Me permite eliminar la imagen en la ubicacion
const eliminarImagen = async (id) => {
    const servicio = await Servicio.findById(id);
    const img = servicio.imagen
    fs.unlinkSync('./public' + img)
}

//Validación para la imagen
const validar = (sevalida, img) => {
    var errors = []
    if (sevalida === 'Y' && img === undefined) {
        errors.push('Seleccione una imagen en formato jpg o png ')
    } else {
        if (errors != '') {
            fs.unlinkSync('./public/uploads/' + img.filename)
        }
    }
    return errors
}

