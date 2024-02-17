import { Router } from "express";
import { createCita, listarCita, eliminarCita, actualizarEstadoCita, CitaPorEstilista, editarCita, listarUnaCita} from '../controllers/Cita.controller.js'


const router = Router();

router
    .get('/citas', listarCita)

    .get('/citas/:id', listarUnaCita)

    .get('/citas/estilista/:estilistaId',CitaPorEstilista)

    .post('/citas',createCita)

    .put('/citas/:id', editarCita)

    .delete('/citas/:id', eliminarCita)

    .put('/citas/estado/:id', actualizarEstadoCita)

    .get('/citas/:estilistaId/citas', getCitasByEstilistaId)

    .get('/citas/:clienteId/citas1', getCitasByClienteId)



export default router;
