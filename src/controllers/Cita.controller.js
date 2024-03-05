
import Cita from '../models/Cita.js';
import Servicio from '../models/Servicio.js'
import Turno from '../models/Turnos.js';
import { transporter } from '../helpers/nodemailer.js'




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

    //subirle un dia para solucionar el error de restarle un dia en el front
    const fechaCalendario = new Date(fechaCita)

    fechaCalendario.setDate(fechaCitaNormalizada.getDate() + 1);

    // const duracionCita = 60 * 60 * 1000; // Duración en milisegundos (1 hora)
    const duracionCita = duracionServicio.duracion * 60 * 1000;
    const horaFinCitaNormalizada = new Date(horaCitaNormalizada.getTime() + duracionCita);



    // Ajustar las fechas a la precisión de minutos
    fechaCitaNormalizada.setSeconds(0, 0);
    horaCitaNormalizada.setSeconds(0, 0);
    horaFinCitaNormalizada.setSeconds(0, 0);

    const diaSemana = obtenerDiaSemana(fechaCitaNormalizada.getDay());

    // console.log("\ndia de la semana del turno:",diaSemana.toLocaleString())

    const turno = await Turno.findOne({ estilista, dia: diaSemana, estado: true });

    if (!turno) {
      return res.status(400).json({ error: 'El estilista no tiene turno disponible para este día o el estado está inactivo.' });
    }

    // if (fechaCitaNormalizada < now) {
    //   return res.status(400).json({ error: 'La fecha de la cita debe ser en el futuro.' });
    // }

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

    console.log('Fecha y hora de inicio(hora):', horaCitaNormalizada.toLocaleString());
    console.log('Fecha y hora de inicio(fecha):', fechaCitaNormalizada.toLocaleString());
    console.log('Fecha y hora de finalizacion:', horaFinCitaNormalizada.toLocaleString());
    console.log('Duracion del servicio:', duracionServicio.duracion.toLocaleString());

    console.log(horaCitaNormalizada >= inicioM && horaFinCitaNormalizada <= finM)
    console.log(horaCitaNormalizada >= inicioT && horaFinCitaNormalizada <= finT)

    // Ajustar las fechas a la precisión de minutos
    inicioM.setSeconds(0, 0);
    finM.setSeconds(0, 0);
    inicioT.setSeconds(0, 0);
    finT.setSeconds(0, 0);



    if (
      !(horaCitaNormalizada >= inicioMToday && horaFinCitaNormalizada <= finMToday) &&
      !(horaCitaNormalizada >= inicioTToday && horaFinCitaNormalizada <= finTToday)
    ) {
      return res.status(400).json({ error: 'La hora de la cita está fuera del rango de trabajo del estilista.' });
    }

    // Verificar si ya existe una cita para el estilista en el mismo rango de horas
    const existingCitaSameRange = await Cita.findOne({
      estilista,
      cliente,
      fechaCita: fechaCitaNormalizada,
      $or: [
        {
          $and: [
            { horaCita: { $lt: horaFinCitaNormalizada } },
            { horaFinCita: { $gt: horaCitaNormalizada } },
          ],
        },
      ],
    });
    
    if (existingCitaSameRange) {
      return res.status(400).json({ error: 'Ya existe una cita para el estilista y cliente en el mismo rango de horas.' });
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

  // Obtener todas las citas del cliente en el día dado y verificar conflictos
  const citasClienteEnElDia = await Cita.find({
    cliente,
    fechaCita: fechaCitaNormalizada,
  }).exec();

  const conflictoCitasCliente = citasClienteEnElDia.some(cita => {
    return (
      (horaCitaNormalizada >= cita.horaCita && horaCitaNormalizada < cita.horaFinCita) ||
      (horaFinCitaNormalizada > cita.horaCita && horaFinCitaNormalizada <= cita.horaFinCita) ||
      (horaCitaNormalizada <= cita.horaCita && horaFinCitaNormalizada >= cita.horaFinCita)
    );
  });

  if (conflictoCitasCliente) {
    return res.status(400).json({ error: 'El cliente ya tiene una cita en el mismo rango de horas.' });
  }

    


    // Crear y guardar la nueva cita
    const cita = new Cita({
      cliente,
      servicio,
      estilista,
      fechaCita: fechaCalendario,
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
    // console.error(error);
    if (error.code === 11000) {
      // Manejar el error de clave duplicada
      return res.status(400).json({ error: 'Ya existe una cita con estos detalles.' });
    }else{
      res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
  }
};


function obtenerDiaSemana(dia) {
  const diasSemana = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  return diasSemana[dia];
}

export const listarUnaCita = async (req, res) => {
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
    return res.status(500).json({ message: error.message })
  }
}

export const editarCita = async (req, res) => {
  try {
    const id = req.params.id;
    const { cliente, servicio, estilista, fechaCita, horaCita } = req.body;

    console.log("fecha que trae el formulario", fechaCita.toLocaleString())
    console.log("hora que trae el formulario", horaCita.toLocaleString())

    const fechaCitaNormalizada = new Date(fechaCita);
    const horaCitaNormalizada = new Date(horaCita);
    const now = new Date(); // Obtener la fecha y hora actual

    fechaCitaNormalizada.setMilliseconds(0);
    horaCitaNormalizada.setMilliseconds(0);

    //subirle un dia para solucionar el error de restarle un dia en el front
    const fechaCalendario = new Date(fechaCita)

    fechaCalendario.setDate(fechaCitaNormalizada.getDate() + 1);

    // Obtén la duración del servicio desde la base de datos (puedes necesitar ajustar esto según tu modelo)
    const duracionServicio = await Servicio.findById(servicio).select('duracion').exec();

    // const duracionCita = 60 * 60 * 1000; // Duración en milisegundos (1 hora)
    const duracionCita = duracionServicio.duracion * 60 * 1000;
    const horaFinCitaNormalizada = new Date(horaCitaNormalizada.getTime() + duracionCita);



    // Ajustar las fechas a la precisión de minutos
    fechaCitaNormalizada.setSeconds(0, 0);
    horaCitaNormalizada.setSeconds(0, 0);
    horaFinCitaNormalizada.setSeconds(0, 0);




    const diaSemana = obtenerDiaSemana(fechaCitaNormalizada.getDay());

    // console.log("\ndia de la semana del turno:",diaSemana.toLocaleString())

    const turno = await Turno.findOne({ estilista, dia: diaSemana, estado: true });

    if (!turno) {
      return res.status(400).json({ error: 'El estilista no tiene turno disponible para este día o el estado está inactivo.' });
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

    const existingCita = await Cita.findOne({
      estilista,
      fechaCita: fechaCitaNormalizada,
      horaCita: horaCitaNormalizada,
      servicio,
    });
    
    if (existingCita) {
      return res.status(400).json({ error: 'Ya existe una cita con estos detalles.' });
    }


    const existingCitaRange = await Cita.aggregate([
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

    if (existingCitaRange.length > 0) {
      return res.status(400).json({ error: 'Ya existe una cita para el estilista en el mismo rango de horas.' });
    }

    const citaActualizada = await Cita.findByIdAndUpdate(id, { cliente, servicio, estilista, fechaCita, horaCita }, { new: true });

    res.status(200).json({
      message: 'Cita actualizada exitosamente',
      cita: {
        cliente: citaActualizada.cliente,
        servicio: citaActualizada.servicio,
        estilista: citaActualizada.estilista,
        fechaCita: fechaCalendario,
        horaCita: citaActualizada.horaCita,
        horaFinCita: citaActualizada.horaFinCita,
      },
    });
  } catch (error) {
    // console.error(error);
    if (error.code === 11000) {
      // Manejar el error de clave duplicada
      return res.status(400).json({ error: 'Ya existe una cita con estos detalles.' });
    }else{
      res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
  }
};





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


export const eliminarCita = async (req, res) => {
  try {
    const id = req.params.id;
    const eliminadoCita = await Cita.deleteOne({ _id: id });
    res.status(204).json(eliminadoCita);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: error.message })
  }
}


export const actualizarEstadoCita = async (req, res) => {
  try {
    const citaId = req.params.id;
    const nuevoEstado = req.body.estado;

    // Realiza la lógica para actualizar el estado en la base de datos
    const citaActualizada = await Cita.findByIdAndUpdate(citaId, { estado: nuevoEstado }, { new: true })
      .populate('cliente')
      .populate('estilista')
      .populate('servicio');

    if (!citaActualizada) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    // Verifica si el nuevo estado es uno de los estados válidos
    if (!['confirmada', 'cancelada', 'pendiente', 'finalizada'].includes(nuevoEstado)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }
    if(['confirmada', 'cancelada'].includes(nuevoEstado)){
      const htmlMessage = `
    <div style="border-radius: 8px; border: 1px solid #e2e8f0; background-color: #fff; color: #1a202c; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);" data-v0-t="card">
        <div style="padding: 24px;" class="flex flex-col space-y-1.5">
            <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 24px; height: 24px;">
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                    <h1 style="font-size: 1.5rem; font-weight: bold; margin: 0;">Cita Agendada</h1>
                </div>
            </div>
        </div>
        <div style="padding: 24px;">
            <div style="grid-gap: 0.5rem; font-size: 0.875rem;">
                <div style="display: grid; grid-template-columns: 1fr auto; gap: 0.25rem;">
                    <div style="font-weight: 500;">Para</div>
                    <div style="text-align: right;">${citaActualizada.cliente.nombre} ${citaActualizada.cliente.apellido}</div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr auto; gap: 0.25rem;">
                    <div style="font-weight: 500;">De</div>
                    <div style="text-align: right;">Salón de Cielo Spa</div>
                </div>
            </div>
            <div style="border-top: 1px solid #e2e8f0; margin-top: 1rem; margin-bottom: 1rem;"></div>
            <div style="font-size: 1rem; margin-bottom: 1rem; line-height: 1.5;">
                <p>Hola,</p>
                <p>Nos complace informarle que el estado de su cita ha sido actualizado a: ${nuevoEstado}.</p>
                <p>Aquí están los detalles de su cita:</p>
                <ul style="margin-bottom: 1rem; padding-left: 1rem;">
                    <li><strong>Servicio:</strong> ${citaActualizada.servicio.nombre_servicio}</li>
                    <li><strong>Estilista:</strong> ${citaActualizada.estilista.nombre} ${citaActualizada.estilista.apellido}</li>
                    <li><strong>Fecha de la cita:</strong> ${citaActualizada.fechaCita.toLocaleString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })}</li>
                    <li><strong>Hora de la cita:</strong> ${citaActualizada.horaCita.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true  })}</li>
                </ul>
                <p>Gracias por elegir el Salón de Cielo Spa. Esperamos verlo el día de su cita.</p>
                <p>Saludos cordiales,</p>
                <p>El equipo del Salón de Cielo spa</p>
            </div>
        </div>
    </div>
`;

    await transporter.sendMail({
      from: '"Cambio de estado de cita 👻" <beautysoft262@gmail.com>', 
      to: citaActualizada.cliente.email, 
      subject: "Cambio de estado de cita", 
      text: "Hello world?", 
      html: htmlMessage, 
    });

      
    }
    
    res.status(200).json({ message: 'Estado de la cita actualizado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
};

export const getCitasByEstilistaId = async (req, res) => {

  try {
    const estilistaId = req.params.estilistaId;
    const citas = await Cita.find({ estilista: estilistaId })

      .populate('estilista')
      .populate('cliente').

      populate('servicio')

    res.json(citas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las citas del estilista.' });
  }
};

export const getCitasByClienteId = async (req, res) => {
  try {
    const clienteId = req.params.clienteId;
    console.log('ID del cliente:', clienteId);

    // Busca todas las citas asociadas al ID del cliente
    const citas = await Cita.find({ cliente: clienteId })
      .populate('estilista')
      .populate('cliente').

      populate('servicio');

    res.json(citas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};