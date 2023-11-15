import Router from 'express'
import { createServicio, listarServicio, editarServicio, eliminarServicio, listarUnServicio } from '../controllers/Servicio.controller.js'

const router = Router()

router.get('/servicios', listarServicio)

    .get('/servicios/:id',listarUnServicio )

    .post('/servicios', createServicio)

    .put('/servicios/:id', editarServicio )
    
    .delete('/servicios/:id', eliminarServicio )


export default router;