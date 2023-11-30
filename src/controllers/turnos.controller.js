import Turno from '../models/Turnos.js'
export const createTurnos = async (req, res) =>{
    try {

        const turno= Turno(req.body)     
        const turnoSave= await turno.save()

        res.status(201).json(turnoSave);
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
        const turno = await Turno.find();
        return res.status(200).json(turno)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message })
    }

}