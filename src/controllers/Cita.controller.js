
import Cita from '../models/Cita.js';
import Turno from '../models/Turnos.js';
export const createCita = async (req, res) => {
  try {
    const { cliente, servicio, estilista, fechaCita, horaCita } = req.body;

    const fechaCitaNormalizada = new Date(fechaCita);
    const horaCitaNormalizada = new Date(horaCita);

    fechaCitaNormalizada.setMilliseconds(0);
    horaCitaNormalizada.setMilliseconds(0);

    const duracionCita = 60 * 60 * 1000; // Duración en milisegundos (1 hora)
    const horaFinCitaNormalizada = new Date(horaCitaNormalizada.getTime() + duracionCita);

    // Ajustar las fechas a la precisión de minutos
    fechaCitaNormalizada.setSeconds(0, 0);
    horaCitaNormalizada.setSeconds(0, 0);
    horaFinCitaNormalizada.setSeconds(0, 0);



    const diaSemana = obtenerDiaSemana(fechaCitaNormalizada.getDay());
    const turno = await Turno.findOne({ estilista, dia: diaSemana });

    if (!turno) {
      return res.status(400).json({ error: 'El estilista no tiene turno disponible para este día.' });
    }

    const { inicioM, finM, inicioT, finT } = turno;

    // Ajustar las fechas a la precisión de minutos
    inicioM.setSeconds(0, 0);
    finM.setSeconds(0, 0);
    inicioT.setSeconds(0, 0);
    finT.setSeconds(0, 0);

    if (
      !(horaCitaNormalizada >= inicioM && horaFinCitaNormalizada <= finM) &&
      !(horaCitaNormalizada >= inicioT && horaFinCitaNormalizada <= finT)
    ) {
      return res.status(400).json({ error: 'La hora de la cita está fuera del rango de trabajo del estilista.' });
    }

    // Verificar si ya existe una cita para el estilista en el mismo rango de horas
    const existingCitaSameRange = await Cita.findOne({
      estilista,
      fechaCita: fechaCitaNormalizada,
      $or: [
        { $and: [{ horaCita: { $gte: horaCitaNormalizada } }, { horaCita: { $lt: horaFinCitaNormalizada } }] },
        { $and: [{ horaFinCita: { $gte: horaCitaNormalizada } }, { horaFinCita: { $lt: horaFinCitaNormalizada } }] },
      ],
    });

    if (existingCitaSameRange) {
      return res.status(400).json({ error: 'Ya existe una cita para el estilista en el mismo rango de horas.' });
    }

    // Crear y guardar la nueva cita
    const cita = new Cita({
      cliente,
      servicio,
      estilista,
      fechaCita: fechaCitaNormalizada,
      horaCita: horaCitaNormalizada,
      horaFinCita: horaFinCitaNormalizada,
      turno: turno._id,
    });

    const citaSave = await cita.save();

    res.status(201).json({
      message: 'Cita creada exitosamente',
      cita: {
        cliente: citaSave.cliente,
        servicio: citaSave.servicio,
        estilista: citaSave.estilista,
        fechaCita: citaSave.fechaCita,
        horaCita: citaSave.horaCita,
        horaFinCita: citaSave.horaFinCita,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};


function obtenerDiaSemana(dia) {
  const diasSemana = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  return diasSemana[dia];
}





export const listarCita = async (req, res) => {
  try {
    const citas = await Cita.find()
      .populate({
        path: 'cliente',
        model: 'User'
      })
      .populate({
        path: 'servicio',
        model: 'Servicio'
      })
      .populate({
        path: 'estilista',
        model: 'Estilista'
      });

    res.status(200).json(citas);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
