import Turno from '../models/Turnos.js'
export const createTurnos = async (req, res) =>{
    try {
        const { fechaInicio, fechaFin, estilista } = req.body;

        // Crear una nueva instancia del modelo Turno con los datos de la solicitud
        const nuevoTurno = new Turno({
            fechaInicio,
            fechaFin,
            estilista, 
        });

        // Guardar el nuevo turno en la base de datos
        const turnoGuardado = await nuevoTurno.save();

        res.status(201).json(turnoGuardado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
}

export const listarTurnos=async(req,res)=>{
    try {
        if (!Turno) {
            return res.status(404).json({ message: 'No se encontraron turnos.' });
        }
        const turno = await Turno.find().populate('estilista');
        return res.status(200).json(turno)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }

}