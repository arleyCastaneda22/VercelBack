
import Cita from '../models/Cita.js';
import Servicio from '../models/Servicio.js'
import Turno from '../models/Turnos.js';



export const createCita = async (req, res) => {
  try {
    const { cliente, servicio, estilista, fechaCita, horaCita } = req.body;

    const fechaCitaNormalizada = new Date(fechaCita);
    const horaCitaNormalizada = new Date(horaCita);

    fechaCitaNormalizada.setMilliseconds(0);
    horaCitaNormalizada.setMilliseconds(0);
    
    // Obtén la duración del servicio desde la base de datos (puedes necesitar ajustar esto según tu modelo)
    const duracionServicio = await Servicio.findById(servicio).select('duracion').exec();

    // const duracionCita = 60 * 60 * 1000; // Duración en milisegundos (1 hora)
    const duracionCita = duracionServicio.duracion * 60 * 1000;
    const horaFinCitaNormalizada = new Date(horaCitaNormalizada.getTime() + duracionCita);

    
    
    // Ajustar las fechas a la precisión de minutos
    fechaCitaNormalizada.setSeconds(0, 0);
    horaCitaNormalizada.setSeconds(0, 0);
    horaFinCitaNormalizada.setSeconds(0, 0);


    // Calcula la hora de finalización de la cita sumando la duración del servicio
    const horaFinCita = new Date(horaCitaNormalizada.getTime() + duracionServicio.duracion);

    // const prueba = duracionServicio.duracion * 60 * 1000;

    // const prueba2 = duracionCita


    const diaSemana = obtenerDiaSemana(fechaCitaNormalizada.getDay());
    console.log("dia de la semana del turno:",diaSemana.toLocaleString())
    const turno = await Turno.findOne({ estilista, dia: diaSemana });

    if (!turno) {
      return res.status(400).json({ error: 'El estilista no tiene turno disponible para este día.' });
    }

    const { inicioM, finM, inicioT, finT } = turno;


    console.log('Fecha y hora de la CITA:', horaCitaNormalizada.toLocaleString());
    console.log('Fecha y hora de FIN de la cita:', horaFinCitaNormalizada.toLocaleString());
    console.log('Duracion del servicio:', horaFinCita.toLocaleString());
    console.log('Duracion del servicio:', duracionServicio.toLocaleString());
    // console.log('Duracion del servicio:', prueba2);

    // Ajustar las fechas a la precisión de minutos
    inicioM.setSeconds(0, 0);
    finM.setSeconds(0, 0);
    inicioT.setSeconds(0, 0);
    finT.setSeconds(0, 0);
    
    console.log('inicio del turno MAÑANA:\n', inicioM.toLocaleString());
    console.log('fin del Turno MAÑANA:', finM.toLocaleString());
    console.log('inicio del turno TARDE:', inicioT.toLocaleString());
    console.log('fin del Turno TARDE:', finT.toLocaleString());
    
    if (
      (horaCitaNormalizada >= inicioM && horaFinCitaNormalizada <= finM) ||
      (horaCitaNormalizada >= inicioT && horaFinCitaNormalizada <= finT)
    ) {
      return res.status(400).json({ error: 'La hora de la cita está fuera del rango de trabajo del estilista.' });
    }

    // Verificar si ya existe una cita para el estilista en el mismo rango de horas
    const existingCitaSameRange = await Cita.findOne({
      estilista,
      fechaCita: fechaCitaNormalizada,
      $or: [
        {
          $and: [
            { horaCita: { $lte: horaCitaNormalizada } },
            { horaFinCita: { $gt: horaCitaNormalizada } },
          ],
        },
        {
          $and: [
            { horaCita: { $lt: horaFinCitaNormalizada } },
            { horaFinCita: { $gte: horaFinCitaNormalizada } },
          ],
        },
        {
          $and: [
            { horaCita: { $gte: horaCitaNormalizada } },
            { horaFinCita: { $lte: horaFinCitaNormalizada } },
          ],
        },
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


export const eliminarCita=async(req,res)=>{
  try {
      const id =req.params.id;
      const eliminadoCita=await Cita.deleteOne({_id:id});
      res.status(204).json(eliminadoCita);
  } catch (error) {
      console.log(error)
      return res.status(500).json({message: error.message})
  }
}


export const actualizarEstadoCita = async (req, res) => {
  try {
    const citaId = req.params.id;
    const nuevoEstado = req.body.estado;

    // Realiza la lógica para actualizar el estado en la base de datos
    const citaActualizada = await Cita.findByIdAndUpdate(citaId, { estado: nuevoEstado }, { new: true });

    if (!citaActualizada) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    // Verifica si el nuevo estado es uno de los estados válidos
    if (!['confirmada', 'cancelada','pendiente'].includes(nuevoEstado)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }



    res.status(200).json({ message: 'Estado de la cita actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};
