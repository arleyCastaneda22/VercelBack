import Cita from '../models/Cita.js'

export const getCitas = async (req, res) => {
    try {
      const citas = await Cita.find();
      res.json(citas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Obtener una cita por ID
export const getCitaById = async (req, res) => {
    try {
      const cita = await Cita.findById(req.params.id);
      res.json(cita);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Crear una nueva cita
export const createCita = async (req, res) => {
    const { fecha, estilista, servicio } = req.body;
    try {
      const nuevaCita = new Cita({ fecha, estilista, servicio });
      await nuevaCita.save();
      res.json(nuevaCita);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Actualizar una cita por ID
export const updateCita = async (req, res) => {
    const { fecha, estilista, servicio } = req.body;
    try {
      const cita = await Cita.findById(req.params.id);
      if (!cita) {
        return res.status(404).json({ message: 'Cita no encontrada' });
      }
      cita.fecha = fecha;
      cita.estilista = estilista;
      cita.servicio = servicio;
      await cita.save();
      res.json(cita);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  // Eliminar una cita por ID
export const deleteCita = async (req, res) => {
    try {
      const cita = await Cita.findById(req.params.id);
      if (!cita) {
        return res.status(404).json({ message: 'Cita no encontrada' });
      }
      await cita.remove();
      res.json({ message: 'Cita eliminada con éxito' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };