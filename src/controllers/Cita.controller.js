
import Cita from '../models/Cita.js';
import Servicio from '../models/Servicio.js'
import Turno from '../models/Turnos.js';
import Cliente from '../models/Cliente.js';



export const createCita = async (req, res) => {
  try {
    const { cliente, servicio, estilista, fechaCita, horaCita } = req.body;
    
    const fechaCitaNormalizada = new Date(fechaCita);
    const horaCitaNormalizada = new Date(horaCita);
    const now = new Date(); // Obtener la fecha y hora actual
    
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

    const diaSemana = obtenerDiaSemana(fechaCitaNormalizada.getDay());

    // console.log("\ndia de la semana del turno:",diaSemana.toLocaleString())

    const turno = await Turno.findOne({ estilista, dia: diaSemana });

    if (!turno) {
      return res.status(400).json({ error: 'El estilista no tiene turno disponible para este día.' });
    }

    
    const { inicioM, finM, inicioT, finT } = turno;
    
    const inicioMToday = new Date(now); // Crear una nueva fecha basada en la actual
    inicioMToday.setHours(inicioM.getHours(), inicioM.getMinutes(), 0, 0);

    const finMToday = new Date(now);
    finMToday.setHours(finM.getHours(), finM.getMinutes(), 0, 0);

    const inicioTToday = new Date(now);
    inicioTToday.setHours(inicioT.getHours(), inicioT.getMinutes(), 0, 0);

    const finTToday = new Date(now);
    finTToday.setHours(finT.getHours(), finT.getMinutes(), 0, 0);
    
    console.log('Inicio del turno MAÑANA:', inicioMToday.toLocaleString());
    console.log('Fin del Turno MAÑANA:', finMToday.toLocaleString());
    console.log('Inicio del turno TARDE:', inicioTToday.toLocaleString());
    console.log('Fin del Turno TARDE:', finTToday.toLocaleString());

    console.log('Fecha y hora de inicio:', horaCitaNormalizada.toLocaleString());
    console.log('Fecha y hora de finalizacion:', horaFinCitaNormalizada.toLocaleString());
    console.log('Duracion del servicio:', duracionServicio.duracion.toLocaleString());

    console.log(horaCitaNormalizada >= inicioM && horaFinCitaNormalizada <= finM)
    console.log(horaCitaNormalizada >= inicioT && horaFinCitaNormalizada <= finT)

    // Ajustar las fechas a la precisión de minutos
    inicioM.setSeconds(0, 0);
    finM.setSeconds(0, 0);
    inicioT.setSeconds(0, 0);
    finT.setSeconds(0, 0);


    //citas futuras
    
    const DateToday = new Date(now);

    DateToday.setHours(inicioMToday.getHours(), 0, 0, 0);

    console.log("la fecha de hoy es: ",DateToday.toLocaleString());
    console.log(DateToday.getHours())
    console.log(now.getHours())
    console.log(fechaCitaNormalizada.getHours())
    console.log(DateToday.getDay())
    console.log(now.getDay())


    if (horaCitaNormalizada.getHours() < now.getHours() || fechaCitaNormalizada.getDate() < now.getDate()) {
      return res.status(400).json({ error: 'La fecha de la cita debe ser en el futuro.' });
    } 
    
    if (
      !(horaCitaNormalizada >= inicioMToday && horaFinCitaNormalizada <= finMToday) &&
      !(horaCitaNormalizada >= inicioTToday && horaFinCitaNormalizada <= finTToday)
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


    const existingCita = await Cita.aggregate([
      {
        $match: {
          estilista,
          fechaCita: {
            $gte: fechaCitaNormalizada,
            $lt: new Date(horaFinCitaNormalizada.getTime() + duracionCita),
          },
        },
      },
      {
        $lookup: {
          from: 'turnos',
          localField: 'estilista',
          foreignField: 'estilista',
          as: 'turno',
        },
      },
      {
        $unwind: '$turno',
      },
      {
        $project: {
          'turno.inicioM': 1,
          'turno.finM': 1,
          'turno.inicioT': 1,
          'turno.finT': 1,
          'cita.fechaCita': 1,
          'cita.horaCita': 1,
          'cita.horaFinCita': 1,
        },
      },
      {
        $addFields: {
          inicioTurno: {
            $cond: [
              { $eq: ['$turno.dia', diaSemana] },
              { $cond: [{ $eq: ['$turno.turno', 'MAÑANA'] }, '$turno.inicioM', '$turno.inicioT'] },
              null,
            ],
          },
          finTurno: {
            $cond: [
              { $eq: ['$turno.dia', diaSemana] },
              { $cond: [{ $eq: ['$turno.turno', 'MAÑANA'] }, '$turno.finM', '$turno.finT'] },
              null,
            ],
          },
        },
      },
      {
        $match: {
          $or: [
            {
              $and: [
                { 'cita.horaCita': { $lte: '$inicioTurno' } },
                { 'cita.horaFinCita': { $gt: '$inicioTurno' } },
              ],
            },
            {
              $and: [
                { 'cita.horaCita': { $lt: '$finTurno' } },
                { 'cita.horaFinCita': { $gte: '$finTurno' } },
              ],
            },
            {
              $and: [
                { 'cita.horaCita': { $gte: '$inicioTurno' } },
                { 'cita.horaFinCita': { $lte: '$finTurno' } },
              ],
            },
          ],
        },
      },
      {
        $limit: 1,
      },
    ]);
    
    if (existingCita.length > 0) {
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

async function verificarDisponibilidadTurno(estilista, fechaCita, horaCita, duracionCita) {
  // Obtener el turno del estilista para el día correspondiente
  const turno = await Turno.findOne({ estilista, dia: obtenerDiaSemana(fechaCita.getDay()) });

  if (!turno) {
    return false; // El estilista no tiene turno disponible para este día
  }

  // Ajustar las fechas a la precisión de minutos
  const inicioTurno = ajustarFechaPrecision(turno.inicioM);
  const finTurno = ajustarFechaPrecision(turno.finT);

  // Verificar si la hora de la cita está dentro del rango del turno
  if (horaCita < inicioTurno || horaCita > finTurno) {
    return false; // La hora de la cita está fuera del rango de trabajo del estilista
  }

  return true; // El turno está disponible
}

async function verificarCitaDuplicada(estilista, fechaCita, horaCita, duracionCita) {
  // Obtener todas las citas para el estilista en la misma fecha
  const citasEnFecha = await Cita.find({
    estilista,
    fechaCita: {
      $gte: fechaCita,
      $lt: new Date(horaCita.getTime() + duracionCita),
    },
  });

  // Verificar si hay alguna cita que se superponga en horario
  const citaDuplicada = citasEnFecha.some((cita) => {
    const inicioCita = ajustarFechaPrecision(cita.horaCita);
    const finCita = ajustarFechaPrecision(cita.horaFinCita);

    return (
      (horaCita >= inicioCita && horaCita < finCita) ||
      (horaCita < inicioCita && horaCita < finCita && horaCita < finCita)
    );
  });

  return citaDuplicada;
}


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


export const listarUnaCita=async(req,res)=>{
  try {
      const id = req.params.id;
      const cita = await Cita.findById(id)
      .populate('estilista')
      .populate('cliente')
      .populate('servicio')

      console.log('Cita encontrada:', cita);


      res.status(200).send(cita)
  } catch (error) {
      console.log(error)
      return res.status(500).json({message: error.message})
  }
}



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

export const CitaPorEstilista = async (req, res) => {
  try {
    const estilistaId = req.params.estilistaId;

    // Realiza la consulta en la base de datos para obtener citas por estilista
    const citasPorEstilista = await Cita.find({ estilista: estilistaId })
      .populate('estilista')
      .populate('cliente')  // Cargar información completa del cliente
      .populate('servicio'); // Cargar información completa del servicio

    res.json(citasPorEstilista);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

export const listarUsuarios = async(req, res)=>{
  try {
      const user= await User.find().populate('roles','nombre');
      res.status(200).json(user)
  } catch (error) {
      console.log(error)
      return res.status(500).json({message: error.message})
  }
}

export const editarCita = async (req, res) => {
  try {
    const id=req.params.id;
    const { cliente, servicio, estilista, fechaCita, horaCita } = req.body;

    console.log("fecha que trae el formulario",fechaCita.toLocaleString())
    console.log("hora que trae el formulario",horaCita.toLocaleString())
    
    const fechaCitaNormalizada = new Date(fechaCita);
    const horaCitaNormalizada = new Date(horaCita);
    const now = new Date(); // Obtener la fecha y hora actual
    
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

    const diaSemana = obtenerDiaSemana(fechaCitaNormalizada.getDay());

    // console.log("\ndia de la semana del turno:",diaSemana.toLocaleString())

    const turno = await Turno.findOne({ estilista, dia: diaSemana });

    if (!turno) {
      return res.status(400).json({ error: 'El estilista no tiene turno disponible para este día.' });
    }

    
    const { inicioM, finM, inicioT, finT } = turno;

    const inicioMToday = new Date(horaCitaNormalizada); // Crear una nueva fecha basada en la actual
    inicioMToday.setHours(inicioM.getHours(), inicioM.getMinutes(), 0, 0);

    const finMToday = new Date(now);
    finMToday.setHours(finM.getHours(), finM.getMinutes(), 0, 0);

    const inicioTToday = new Date(now);
    inicioTToday.setHours(inicioT.getHours(), inicioT.getMinutes(), 0, 0);

    const finTToday = new Date(now);
    finTToday.setHours(finT.getHours(), finT.getMinutes(), 0, 0);

    console.log('Inicio del turno MAÑANA:', inicioMToday.toLocaleString());
    console.log('Fin del Turno MAÑANA:', finMToday.toLocaleString());
    console.log('Inicio del turno TARDE:', inicioTToday.toLocaleString());
    console.log('Fin del Turno TARDE:', finTToday.toLocaleString());

    console.log('Fecha y hora de inicio:', horaCitaNormalizada.toLocaleString());
    console.log('Fecha y hora de finalizacion:', horaFinCitaNormalizada.toLocaleString());
    console.log('Duracion del servicio:', duracionServicio.duracion.toLocaleString());

    console.log(horaCitaNormalizada >= inicioM && horaFinCitaNormalizada <= finM)
    console.log(horaCitaNormalizada >= inicioT && horaFinCitaNormalizada <= finT)

    // Ajustar las fechas a la precisión de minutos
    inicioM.setSeconds(0, 0);
    finM.setSeconds(0, 0);
    inicioT.setSeconds(0, 0);
    finT.setSeconds(0, 0);

    const DateToday = new Date(now);

    DateToday.setHours(inicioMToday.getHours(), 0, 0, 0);


      //citas futuras    
    if (horaCitaNormalizada.getHours() < now.getHours() || fechaCitaNormalizada.getDate() < now.getDate()) {
      return res.status(400).json({ error: 'La fecha de la cita debe ser en el futuro.' });
    }
    
    
    if (
      !(horaCitaNormalizada >= inicioMToday && horaFinCitaNormalizada <= finMToday) &&
      !(horaCitaNormalizada >= inicioTToday && horaFinCitaNormalizada <= finTToday)
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


    const existingCita = await Cita.aggregate([
      {
        $match: {
          estilista,
          fechaCita: {
            $gte: fechaCitaNormalizada,
            $lt: new Date(horaFinCitaNormalizada.getTime() + duracionCita),
          },
        },
      },
      {
        $lookup: {
          from: 'turnos',
          localField: 'estilista',
          foreignField: 'estilista',
          as: 'turno',
        },
      },
      {
        $unwind: '$turno',
      },
      {
        $project: {
          'turno.inicioM': 1,
          'turno.finM': 1,
          'turno.inicioT': 1,
          'turno.finT': 1,
          'cita.fechaCita': 1,
          'cita.horaCita': 1,
          'cita.horaFinCita': 1,
        },
      },
      {
        $addFields: {
          inicioTurno: {
            $cond: [
              { $eq: ['$turno.dia', diaSemana] },
              { $cond: [{ $eq: ['$turno.turno', 'MAÑANA'] }, '$turno.inicioM', '$turno.inicioT'] },
              null,
            ],
          },
          finTurno: {
            $cond: [
              { $eq: ['$turno.dia', diaSemana] },
              { $cond: [{ $eq: ['$turno.turno', 'MAÑANA'] }, '$turno.finM', '$turno.finT'] },
              null,
            ],
          },
        },
      },
      {
        $match: {
          $or: [
            {
              $and: [
                { 'cita.horaCita': { $lte: '$inicioTurno' } },
                { 'cita.horaFinCita': { $gt: '$inicioTurno' } },
              ],
            },
            {
              $and: [
                { 'cita.horaCita': { $lt: '$finTurno' } },
                { 'cita.horaFinCita': { $gte: '$finTurno' } },
              ],
            },
            {
              $and: [
                { 'cita.horaCita': { $gte: '$inicioTurno' } },
                { 'cita.horaFinCita': { $lte: '$finTurno' } },
              ],
            },
          ],
        },
      },
      {
        $limit: 1,
      },
    ]);
    
    if (existingCita.length > 0) {
      return res.status(400).json({ error: 'Ya existe una cita para el estilista en el mismo rango de horas.' });
    }

    const citaActualizada = await Cita.findByIdAndUpdate(id, { cliente, servicio, estilista, fechaCita, horaCita }, { new: true });

    res.status(200).json({
      message: 'Cita actualizada exitosamente',
      cita: {
        cliente: citaActualizada.cliente,
        servicio: citaActualizada.servicio,
        estilista: citaActualizada.estilista,
        fechaCita: citaActualizada.fechaCita,
        horaCita: citaActualizada.horaCita,
        horaFinCita: citaActualizada.horaFinCita,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};
