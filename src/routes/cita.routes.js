import { Router } from "express";
import { createCita, listarCita, eliminarCita, actualizarEstadoCita, CitaPorEstilista} from '../controllers/Cita.controller.js'


const router = Router();

router
    .get('/citas', listarCita )

    .get('/citas/estilista/:estilistaId',CitaPorEstilista)

    .post('/citas',createCita)

    .delete('/citas/:id', eliminarCita)

    .put('/citas/estado/:id',actualizarEstadoCita)



export default router;
