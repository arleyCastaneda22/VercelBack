import Turno from '../models/Turnos.js'
 

import { ObjectId } from 'mongodb';


export const createTurnos = async (req, res) => {
    try {
        const { estilista, dia, inicioM, finM, inicioT, finT } = req.body;

        // Convertir las fechas a objetos Date
        const inicioMDate = new Date(inicioM);
        const finMDate = new Date(finM);
        const inicioTDate = new Date(inicioT);
        const finTDate = new Date(finT);

      

   

        // Verificar si ya existe un turno para el mismo estilista en el mismo día
        const existingTurno = await Turno.findOne({ estilista, dia });

        if (existingTurno) {
            return res.status(400).json({ error: 'Ya existe un turno para el mismo estilista en el mismo día.' });
        }

        if (inicioMDate >= finMDate) {
            return res.status(400).json({ error: 'La hora de inicio de la mañana debe ser menor que la hora de fin de la mañana.' });
        }

        if (finMDate >= inicioTDate) {
            return res.status(400).json({ error: 'La hora de fin de la mañana debe ser menor que la hora de inicio de la tarde.' });
        }

        if (finTDate <= inicioTDate || finTDate <= finMDate) {
            return res.status(400).json({ error: 'La hora de fin de la tarde debe ser mayor que las horas de inicio y fin de la mañana.' });
        }

        const turno = new Turno({
            estilista,
            dia,
            inicioM: inicioMDate,
            finM: finMDate,
            inicioT: inicioTDate,
            finT
        });


        const turnoSave = await turno.save();

        res.status(201).json(turnoSave);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
};


export const listarUnTurno = async (req, res) => {
    try {
        const id = req.params.id;
        const turno = await Turno.findById(id).populate('estilista');


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
        const { estilista, dia, inicioM, finM, inicioT, finT } = req.body;

        // Convertir las fechas a objetos Date
        const inicioMDate = new Date(inicioM);
        const finMDate = new Date(finM);
        const inicioTDate = new Date(inicioT);
        const finTDate = new Date(finT);

        if (inicioMDate >= finMDate) {
            return res.status(400).json({ error: 'La hora de inicio de la mañana debe ser menor que la hora de fin de la mañana.' });
        }

        if (finMDate >= inicioTDate) {
            return res.status(400).json({ error: 'La hora de fin de la mañana debe ser menor que la hora de inicio de la tarde.' });
        }

        if (finTDate <= inicioTDate || finTDate <= finMDate) {
            return res.status(400).json({ error: 'La hora de fin de la tarde debe ser mayor que las horas de inicio y fin de la mañana.' });
        }

        const turno = {
            estilista,
            dia,
            inicioM: inicioMDate,
            finM: finMDate,
            inicioT: inicioTDate,
            finT
        };

        const actualizadoTurno = await Turno.findOneAndUpdate(
            { _id: id },
            { $set: turno },
            { new: true }
        );

        res.status(204).json(actualizadoTurno);
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




