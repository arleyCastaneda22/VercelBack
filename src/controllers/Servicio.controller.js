import Servicio from'../models/Servicio.js'

export const createServicio=async(req, res)=>{
    try {
        const servicio = Servicio(req.body)
    
        const servicioSave = await servicio.save();
        res.status(201).json({status:true, data:servicioSave})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({mesage:error.mesage})
    }


}

