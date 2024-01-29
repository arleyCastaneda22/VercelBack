
import Cita from '../models/Cita.js';
import Turno from '../models/Turnos.js';


export const createCita = async (req, res) => {
  try {
    const { cliente, servicio, estilista, fechaCita, horaCita } = req.body;

    const fechaCitaNormalizada = new Date(fechaCita);
    const horaCitaNormalizada = new Date(horaCita);

    fechaCitaNormalizada.setMilliseconds(0);
    horaCitaNormalizada.setMilliseconds(0);

    const diaSemana = obtenerDiaSemana(fechaCitaNormalizada.getDay());
    const turno = await Turno.findOne({ estilista, dia: diaSemana });

    if (!turno) {
      return res.status(400).json({ error: 'El estilista no tiene turno disponible para este día.' });
    }

    const { inicioM, finM, inicioT, finT } = turno;

    if (
      !(horaCitaNormalizada >= new Date(inicioM) && horaCitaNormalizada <= new Date(finM)) &&
      !(horaCitaNormalizada >= new Date(inicioT) && horaCitaNormalizada <= new Date(finT))
    ) {
      return res.status(400).json({ error: 'La hora de la cita está fuera del rango de trabajo del estilista.' });
    }

    // Verificar si ya existe una cita para el estilista en la misma fecha y hora
    const existingCita = await Cita.findOne({
      estilista,
      fechaCita: fechaCitaNormalizada,
      horaCita: horaCitaNormalizada,
    });

    if (existingCita) {
      return res.status(400).json({ error: 'Ya existe una cita para el estilista en la misma fecha y hora.' });
    }

    const cita = new Cita({
      cliente,
      servicio,
      estilista,
      fechaCita: fechaCitaNormalizada,
      horaCita: horaCitaNormalizada,
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
