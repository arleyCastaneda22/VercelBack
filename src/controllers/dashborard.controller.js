import Cita from '../models/Cita.js';
import moment from 'moment';

export const serviciosUtilizados = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
 
        const serviciosUtilizados = await Cita.aggregate([
            {
                $match: {
                    fechaCita: { $gte: new Date(startDate), $lte: new Date(endDate) }
                }
            },
            {
                $group: {
                    _id: '$servicio',
                    total: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'servicios',
                    localField: '_id',  // Cambiado de 'servicio' a '_id'
                    foreignField: '_id',
                    as: 'servicioInfo'
                }
            },
            {
                $addFields: {
                    servicioInfo: { $arrayElemAt: ['$servicioInfo', 0] }
                }
            }

        ]);

        return res.json(serviciosUtilizados);

    } catch (error) {
        console.error('Error al obtener servicios utilizados:', error);
        return res.status(500).json({ error: 'Error interno del servidor.', details: error.message });
    }

}

export const citasPorDia = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;



        // Ajustar la fecha de fin para incluir todo el día
        const startMoment = moment.utc(startDate);
        const endMoment = moment.utc(endDate).endOf('day');

        // Verificar que startDate no sea mayor que endDate
        if (startMoment.isAfter(endMoment)) {
            return res.status(400).json({ error: "La fecha de inicio no puede ser mayor que la fecha de fin." });
        }

        // Inicializar un objeto para almacenar la cantidad de citas por día de la semana
        const citasPorDia = {
            domingo: 0,
            lunes: 0,
            martes: 0,
            miércoles: 0,
            jueves: 0,
            viernes: 0,
            sábado: 0,
        };

        // Obtener todas las citas entre las fechas dadas
        const citas = await Cita.find({
            fechaCita: { $gte: startMoment, $lte: endMoment },
        });

        moment.locale('es')
        // Contar las citas por día de la semana
        citas.forEach((cita) => {
            const dayName = moment.utc(cita.fechaCita).format('dddd');
            citasPorDia[dayName.toLowerCase()]++;
    
        });

        // Validar si no hay información en esas fechas
        if (Object.values(citasPorDia).every(count => count === 0)) {
            return res.status(400).json({ error: "No hay información disponible para las fechas proporcionadas." });
        }

        res.json({ citasPorDia });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};





