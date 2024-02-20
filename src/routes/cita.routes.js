import { Router } from "express";
import { createCita, listarCita, listarUnaCita, eliminarCita, actualizarEstadoCita, getCitasByEstilistaId, getCitasByClienteId, editarCita} from '../controllers/Cita.controller.js'


const router = Router();

router
    .get('/citas', listarCita)

    .get('/citas/:id', listarUnaCita)

    .post('/citas', createCita)

    .delete('/citas/:id', eliminarCita)

    .put('/citas/estado/:id', actualizarEstadoCita)

    .put('/citas/:id', editarCita)

    .get('/citas/:estilistaId/citas', getCitasByEstilistaId)

    .get('/citas/:clienteId/citas1', getCitasByClienteId)



export default router;