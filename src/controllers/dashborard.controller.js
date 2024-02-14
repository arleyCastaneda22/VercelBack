import Cita from '../models/Cita.js';
import moment from 'moment';

export const serviciosUtilizados = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Validar que se proporcionen las fechas
        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Se requieren fechas de inicio y fin.' });
        }
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
    
        if (!startDate || !endDate) {
          return res.status(400).json({ error: "Se requieren las fechas de inicio y fin." });
        }
    
        const startMoment = moment(startDate).startOf('day');
        const endMoment = moment(endDate).endOf('day');
    
        if (!startMoment.isValid() || !endMoment.isValid()) {
          return res.status(400).json({ error: "Formato de fecha inválido." });
        }

        // Establecer el idioma de Moment.js a español
        moment.locale("es");

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
          fechaCita: { $gte: startMoment.toDate(), $lte: endMoment.toDate() },
        });
    
        // Contar las citas por día de la semana
        citas.forEach((cita) => {
          const dayOfWeek = moment(cita.fechaCita).day();
          const dayName = moment().day(dayOfWeek).format("dddd").toLowerCase();
          citasPorDia[dayName]++;
        });
    
        res.json({ citasPorDia });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno del servidor." });
    }
};



