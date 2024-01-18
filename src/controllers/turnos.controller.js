import Turno from '../models/Turnos.js'
import moment from 'moment-timezone'
import { format } from 'date-fns';
import { es } from 'date-fns/locale';  // Importa el locale para español

import { ObjectId } from 'mongodb';


export const createTurnos = async (req, res) => {
    try {
        const { estilista, dia, inicioM, finM, inicioT, finT } = req.body;

        // Verificar si ya existe un turno para el mismo estilista en el mismo día
        const existingTurno = await Turno.findOne({ estilista, dia });

        if (existingTurno) {
            return res.status(400).json({ error: 'Ya existe un turno para el mismo estilista en el mismo día.' });
        }


        const turno = new Turno({
            estilista,
            dia,
            inicioM: moment(inicioM, 'h:mm A').tz('America/Bogota').toDate(),
            finM: moment(finM, 'h:mm A').tz('America/Bogota').toDate(),
            inicioT: moment(inicioT, 'h:mm A').tz('America/Bogota').toDate(),
            finT: moment(finT, 'h:mm A').tz('America/Bogota').toDate(),
        });

        const turnoSave = await turno.save();
        
        res.status(201).json(turnoSave);
    } catch (error) {
        // Manejar errores
        console.error(error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
};

export const listarUnTurno = async (req, res) => {
    try {
        const id = req.params.id;
        const turno = await Turno.findById(id);


        res.status(200).send(turno);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};



export const listarTurnos = async (req, res) => {
    try {
        const id = req.params.id;
        const convertedEstilistaId = new ObjectId(id);

        const turnos = await Turno.find({ estilista: convertedEstilistaId }).populate('estilista');

        res.status(200).send(turnos)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }
}

export const editarTurno = async (req, res) => {
    try {
        const id = req.params.id;
        const { dia, inicioM, finM, inicioT, finT } = req.body;

        const turnoActualizado = {
            dia,
            inicioM: moment(inicioM, 'h:mm A').tz('America/Bogota').toDate(),
            finM: moment(finM, 'h:mm A').tz('America/Bogota').toDate(),
            inicioT: moment(inicioT, 'h:mm A').tz('America/Bogota').toDate(),
            finT: moment(finT, 'h:mm A').tz('America/Bogota').toDate(),
        };


        const actualizadoTurno = await Turno.findByIdAndUpdate(id, turnoActualizado, { new: true });

        res.status(200).json(actualizadoTurno);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};
export const actualizarEstado = async (req, res) => {
    try {
        const id = req.params.id;
        const actualizadoEstado = await Turno.findById(id)
        actualizadoEstado.estado = !actualizadoEstado.estado;
        await actualizadoEstado.save()
        res.status(204).json(actualizadoEstado);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }
}