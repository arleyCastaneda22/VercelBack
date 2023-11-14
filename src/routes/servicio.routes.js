import Router from 'express'
import { createServicio, listarServicio, actualizarServicio, eliminarServicio } from '../controllers/Servicio.controller.js'
import { subirImagen } from '../middlewares/image.js'
const router = Router()

router.get('/servicios', listarServicio)

    .post('/servicios', subirImagen.single('imagen'), createServicio)

    .put('/servicios/:id', subirImagen.single('imagen'),actualizarServicio )
    
    .delete('/servicios/:id', eliminarServicio )


export default router;