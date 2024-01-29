import Router from 'express'
import { createServicio, listarServicio, editarServicio, eliminarServicio, listarUnServicio, actualizarEstado, estilistaPorServicio} from '../controllers/Servicio.controller.js'

const router = Router()

router.get('/servicios', listarServicio)

    .get('/servicios/:id',listarUnServicio )

    .get('/servicios/estado/:id', actualizarEstado)

    .post('/servicios', createServicio)

    .put('/servicios/:id', editarServicio )
    
    .delete('/servicios/:id', eliminarServicio )

    .get('/servicios/:servicioId/estilista', estilistaPorServicio)


export default router;